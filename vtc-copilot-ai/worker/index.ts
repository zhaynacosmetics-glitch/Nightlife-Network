// Worker Cloudflare de VTC Copilot AI.
// - Sert le site statique (dist/) via le binding ASSETS.
// - Expose l'API de la waitlist et du formulaire de contact, stockées dans D1.

import { LIMITS, validateContact, validateWaitlist } from "../src/lib/validation";

export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
  /** Secret : clé d'accès aux exports (wrangler secret put ADMIN_TOKEN). */
  ADMIN_TOKEN?: string;
  /** Secret : sel du hachage des adresses IP (wrangler secret put IP_HASH_SALT). */
  IP_HASH_SALT?: string;
  /** Secret facultatif : clé secrète Cloudflare Turnstile. */
  TURNSTILE_SECRET_KEY?: string;
  /** Variable facultative : origines autorisées en plus de l'origine du Worker, séparées par des virgules. */
  ALLOWED_ORIGINS?: string;
}

const CONSENT_VERSION = "2026-10-22";
const MAX_BODY = 8 * 1024;
const MIN_ELAPSED_MS = 1500;
const RATE = {
  waitlist: { windowMs: 10 * 60_000, max: 5 },
  contact: { windowMs: 10 * 60_000, max: 3 },
  delete: { windowMs: 10 * 60_000, max: 10 },
} as const;

type Json = Record<string, unknown>;

const SECURITY_HEADERS = {
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
  "referrer-policy": "no-referrer",
};

function json(body: Json | Json[], status = 200, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...SECURITY_HEADERS, ...extra },
  });
}

class HttpError extends Error {
  constructor(
    public status: number,
    public body: Json,
  ) {
    super(String(body.error ?? status));
  }
}

/* ------------------------------------------------------------------ utilitaires */

const enc = new TextEncoder();

async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", enc.encode(input));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function randomToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Comparaison à temps constant (évite les attaques temporelles sur la clé d'admin). */
async function safeEqual(a: string, b: string): Promise<boolean> {
  const [ha, hb] = await Promise.all([crypto.subtle.digest("SHA-256", enc.encode(a)), crypto.subtle.digest("SHA-256", enc.encode(b))]);
  const subtle = crypto.subtle as SubtleCrypto & { timingSafeEqual?: (x: ArrayBuffer, y: ArrayBuffer) => boolean };
  if (subtle.timingSafeEqual) return subtle.timingSafeEqual(ha, hb);
  const x = new Uint8Array(ha);
  const y = new Uint8Array(hb);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

function checkOrigin(req: Request, env: Env) {
  const origin = req.headers.get("origin");
  if (!origin) return; // requêtes non navigateur (tests, outils) : la limitation de débit s'applique quand même
  const self = new URL(req.url).origin;
  const allowed = new Set([self, ...(env.ALLOWED_ORIGINS ?? "").split(",").map((s) => s.trim()).filter(Boolean)]);
  if (!allowed.has(origin)) throw new HttpError(403, { error: "Origine non autorisée." });
}

async function readJson(req: Request): Promise<Json> {
  if (!(req.headers.get("content-type") ?? "").includes("application/json")) throw new HttpError(415, { error: "Format attendu : JSON." });
  const len = Number(req.headers.get("content-length") ?? 0);
  if (len > MAX_BODY) throw new HttpError(413, { error: "Requête trop volumineuse." });
  const text = await req.text();
  if (text.length > MAX_BODY) throw new HttpError(413, { error: "Requête trop volumineuse." });
  try {
    const data = JSON.parse(text);
    if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error();
    return data as Json;
  } catch {
    throw new HttpError(400, { error: "Requête invalide." });
  }
}

async function ipHash(req: Request, env: Env): Promise<string> {
  const ip = req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "inconnue";
  return sha256Hex(`${env.IP_HASH_SALT ?? "vtc-copilot-ai/sel-par-defaut"}|${ip}`);
}

async function rateLimit(env: Env, hash: string, action: keyof typeof RATE) {
  const { windowMs, max } = RATE[action];
  const now = Date.now();
  const row = await env.DB.prepare("SELECT COUNT(*) AS n FROM rate_events WHERE ip_hash = ?1 AND action = ?2 AND created_at > ?3")
    .bind(hash, action, now - windowMs)
    .first<{ n: number }>();
  if ((row?.n ?? 0) >= max) throw new HttpError(429, { error: "Trop de tentatives depuis cette connexion. Réessayez dans quelques minutes." });
  await env.DB.batch([
    env.DB.prepare("INSERT INTO rate_events (ip_hash, action, created_at) VALUES (?1, ?2, ?3)").bind(hash, action, now),
    env.DB.prepare("DELETE FROM rate_events WHERE created_at < ?1").bind(now - 24 * 3600_000),
  ]);
}

async function verifyTurnstile(env: Env, token: unknown, req: Request) {
  if (!env.TURNSTILE_SECRET_KEY) return;
  if (typeof token !== "string" || !token) throw new HttpError(400, { error: "Validez la vérification anti-robot puis réessayez." });
  const form = new FormData();
  form.append("secret", env.TURNSTILE_SECRET_KEY);
  form.append("response", token);
  const ip = req.headers.get("cf-connecting-ip");
  if (ip) form.append("remoteip", ip);
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: form });
  const out = (await res.json().catch(() => ({}))) as { success?: boolean };
  if (!out.success) throw new HttpError(400, { error: "La vérification anti-robot a échoué. Réessayez." });
}

function antiBot(body: Json) {
  // Pot de miel rempli : on répond comme un succès sans rien enregistrer.
  if (typeof body.website === "string" && body.website.trim() !== "") return "bot" as const;
  const elapsed = Number(body.elapsedMs);
  if (Number.isFinite(elapsed) && elapsed >= 0 && elapsed < MIN_ELAPSED_MS) {
    throw new HttpError(429, { error: "Envoi trop rapide. Patientez une seconde puis réessayez." });
  }
  return "ok" as const;
}

/* ------------------------------------------------------------------ routes */

async function postWaitlist(req: Request, env: Env): Promise<Response> {
  checkOrigin(req, env);
  const body = await readJson(req);
  if (antiBot(body) === "bot") return json({ status: "created" }, 201);
  const { data, errors } = validateWaitlist(body);
  if (!data) return json({ error: "Certains champs sont à corriger.", errors }, 400);
  await rateLimit(env, await ipHash(req, env), "waitlist");
  await verifyTurnstile(env, body.turnstileToken, req);

  const token = randomToken();
  const result = await env.DB.prepare(
    `INSERT INTO waitlist (email, first_name, zone, consent_marketing, consent_research, consent_text_version, delete_token_hash)
     VALUES (?1, ?2, ?3, 1, ?4, ?5, ?6) ON CONFLICT(email) DO NOTHING`,
  )
    .bind(data.email, data.firstName, data.zone || null, data.consentResearch ? 1 : 0, CONSENT_VERSION, await sha256Hex(token))
    .run();

  if (!result.meta.changes) return json({ status: "already" }, 200);
  return json({ status: "created", token }, 201);
}

async function deleteWaitlist(req: Request, env: Env): Promise<Response> {
  checkOrigin(req, env);
  const body = await readJson(req);
  await rateLimit(env, await ipHash(req, env), "delete");
  const token = typeof body.token === "string" ? body.token : "";
  if (!/^[A-Za-z0-9_-]{40,64}$/.test(token)) return json({ error: "Lien invalide." }, 400);
  const res = await env.DB.prepare("DELETE FROM waitlist WHERE delete_token_hash = ?1").bind(await sha256Hex(token)).run();
  if (!res.meta.changes) return json({ error: "Inscription introuvable." }, 404);
  return json({ status: "deleted" });
}

async function postContact(req: Request, env: Env): Promise<Response> {
  checkOrigin(req, env);
  const body = await readJson(req);
  if (antiBot(body) === "bot") return json({ status: "sent" }, 201);
  const { data, errors } = validateContact(body);
  if (!data) return json({ error: "Certains champs sont à corriger.", errors }, 400);
  await rateLimit(env, await ipHash(req, env), "contact");
  await verifyTurnstile(env, body.turnstileToken, req);
  await env.DB.prepare("INSERT INTO contact_requests (name, organisation, email, message) VALUES (?1, ?2, ?3, ?4)")
    .bind(data.name, data.organisation || null, data.email, data.message.slice(0, LIMITS.messageMax))
    .run();
  return json({ status: "sent" }, 201);
}

async function requireAdmin(req: Request, env: Env) {
  if (!env.ADMIN_TOKEN || env.ADMIN_TOKEN.length < 24) throw new HttpError(503, { error: "Export désactivé : définissez le secret ADMIN_TOKEN (24 caractères minimum)." });
  const auth = req.headers.get("authorization") ?? "";
  const given = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!given || !(await safeEqual(given, env.ADMIN_TOKEN))) throw new HttpError(401, { error: "Non autorisé." });
}

/** Neutralise les formules quand le CSV est ouvert dans un tableur. */
function csvCell(v: unknown): string {
  let s = v === null || v === undefined ? "" : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

async function adminExport(req: Request, env: Env): Promise<Response> {
  await requireAdmin(req, env);
  const url = new URL(req.url);
  const type = url.searchParams.get("type") === "contact" ? "contact" : "waitlist";
  const format = url.searchParams.get("format") === "json" ? "json" : "csv";
  const sql =
    type === "waitlist"
      ? "SELECT id, email, first_name, zone, consent_marketing, consent_research, consent_text_version, created_at FROM waitlist ORDER BY id"
      : "SELECT id, name, organisation, email, message, created_at FROM contact_requests ORDER BY id";
  const { results } = await env.DB.prepare(sql).all<Json>();
  if (format === "json") return json(results);
  const cols = results.length ? Object.keys(results[0]) : [];
  const csv = "﻿" + [cols.join(";"), ...results.map((r) => cols.map((c) => csvCell(r[c])).join(";"))].join("\r\n");
  return new Response(csv, {
    headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": `attachment; filename="vtc-copilot-${type}-${new Date().toISOString().slice(0, 10)}.csv"`, ...SECURITY_HEADERS },
  });
}

async function adminStats(req: Request, env: Env): Promise<Response> {
  await requireAdmin(req, env);
  const row = await env.DB.prepare(
    "SELECT COUNT(*) AS total, SUM(consent_research) AS research, SUM(CASE WHEN created_at >= datetime('now','-7 days') THEN 1 ELSE 0 END) AS last7d FROM waitlist",
  ).first<Json>();
  return json({ waitlist: row });
}

async function handleApi(req: Request, env: Env): Promise<Response> {
  const { pathname } = new URL(req.url);
  const route = `${req.method} ${pathname.replace(/\/$/, "")}`;
  try {
    switch (route) {
      case "POST /api/waitlist":
        return await postWaitlist(req, env);
      case "POST /api/waitlist/delete":
        return await deleteWaitlist(req, env);
      case "POST /api/contact":
        return await postContact(req, env);
      case "GET /api/admin/export":
        return await adminExport(req, env);
      case "GET /api/admin/stats":
        return await adminStats(req, env);
      case "GET /api/health":
        await env.DB.prepare("SELECT 1").first();
        return json({ ok: true });
      default:
        if (["/api/waitlist", "/api/contact", "/api/waitlist/delete"].includes(pathname)) return json({ error: "Méthode non autorisée." }, 405, { allow: "POST" });
        return json({ error: "Ressource introuvable." }, 404);
    }
  } catch (err) {
    if (err instanceof HttpError) return json(err.body, err.status);
    console.error("Erreur API", route, err instanceof Error ? err.message : err);
    return json({ error: "Une erreur est survenue. Réessayez dans quelques instants." }, 500);
  }
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(req.url);
    if (pathname.startsWith("/api/")) return handleApi(req, env);
    return env.ASSETS.fetch(req);
  },
} satisfies ExportedHandler<Env>;
