import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Check, Loader2 } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { site } from "../config/site";
import { validateWaitlist } from "../lib/validation";
import type { FieldErrors } from "../lib/validation";
import { Turnstile } from "./Turnstile";

type State = { kind: "idle" } | { kind: "sending" } | { kind: "done"; already: boolean; token?: string; firstName: string } | { kind: "error"; message: string };

const FIELD_ORDER = ["firstName", "email", "zone", "consentMarketing"] as const;

const input =
  "block w-full rounded-2xl border bg-white px-4 py-3.5 text-[16px] text-ink placeholder:text-faint transition-[border-color,box-shadow] focus:border-violet focus:outline-none focus:ring-4 focus:ring-violet/15";

export function WaitlistForm() {
  const [state, setState] = useState<State>({ kind: "idle" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const startedAt = useRef<number>(0);
  const turnstileToken = useRef<string>("");
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state.kind === "sending") return;
    const fd = new FormData(e.currentTarget);
    const raw = {
      firstName: String(fd.get("firstName") ?? ""),
      email: String(fd.get("email") ?? ""),
      zone: String(fd.get("zone") ?? ""),
      consentMarketing: fd.get("consentMarketing") === "on",
      consentResearch: fd.get("consentResearch") === "on",
    };
    const { data, errors: errs } = validateWaitlist(raw);
    setErrors(errs);
    if (!data) {
      const first = FIELD_ORDER.find((k) => errs[k]);
      if (first) (form.current?.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }

    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...data,
          website: String(fd.get("website") ?? ""),
          elapsedMs: Date.now() - startedAt.current,
          turnstileToken: turnstileToken.current,
        }),
      });
      const body = (await res.json().catch(() => ({}))) as { status?: string; token?: string; errors?: FieldErrors; error?: string };
      if (res.ok && (body.status === "created" || body.status === "already")) {
        setState({ kind: "done", already: body.status === "already", token: body.token, firstName: data.firstName });
        return;
      }
      if (res.status === 400 && body.errors) {
        setErrors(body.errors);
        setState({ kind: "idle" });
        return;
      }
      setState({ kind: "error", message: body.error ?? "L’inscription n’a pas pu être enregistrée. Réessayez dans quelques instants." });
    } catch {
      setState({ kind: "error", message: "Connexion impossible. Vérifiez votre réseau puis réessayez." });
    }
  }

  if (state.kind === "done") {
    const link = state.token ? `/desinscription/?t=${encodeURIComponent(state.token)}` : null;
    return <Success already={state.already} firstName={state.firstName} link={link} />;
  }

  const sending = state.kind === "sending";
  const err = (k: keyof FieldErrors) =>
    errors[k] ? (
      <p id={`${k}-error`} className="mt-1.5 pl-2 text-left text-[13px] text-[#C42A3D]">
        {errors[k]}
      </p>
    ) : null;
  const border = (k: keyof FieldErrors) => (errors[k] ? "border-stop" : "border-line");

  return (
    <form ref={form} noValidate onSubmit={onSubmit} className="relative rounded-[28px] border border-line bg-white p-5 text-left shadow-[0_40px_80px_-40px_rgba(11,13,18,0.25)] sm:p-7" aria-label="Rejoindre la waitlist">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="sr-only">
            Prénom
          </label>
          <input id="firstName" name="firstName" type="text" autoComplete="given-name" maxLength={50} placeholder="Prénom" required aria-invalid={!!errors.firstName} aria-describedby={errors.firstName ? "firstName-error" : undefined} className={`${input} ${border("firstName")}`} />
          {err("firstName")}
        </div>
        <div>
          <label htmlFor="zone" className="sr-only">
            Zone d’activité (facultatif)
          </label>
          <select id="zone" name="zone" defaultValue="" aria-invalid={!!errors.zone} aria-describedby={errors.zone ? "zone-error" : undefined} className={`${input} ${border("zone")} appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'%3E%3Cpath d='M1 1.5 6 6.5 11 1.5' stroke='%235E6472' stroke-width='1.6' stroke-linecap='round'/%3E%3C/svg%3E")] bg-[position:right_1rem_center] bg-no-repeat pr-10`}>
            <option value="">Zone (facultatif)</option>
            {site.waitlist.zones.map((z) => (
              <option key={z.value} value={z.value}>
                {z.label}
              </option>
            ))}
          </select>
          {err("zone")}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="email" className="sr-only">
            Adresse e-mail
          </label>
          <input id="email" name="email" type="email" inputMode="email" autoComplete="email" spellCheck={false} maxLength={254} placeholder="Adresse e-mail" required aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} className={`${input} ${border("email")}`} />
          {err("email")}
        </div>
      </div>

      {/* Pot de miel : invisible pour les humains, rempli par les robots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Ne pas remplir ce champ</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-4 space-y-2">
        <label className="flex cursor-pointer gap-3 rounded-xl p-1 text-[14px] leading-snug text-ink">
          <input type="checkbox" name="consentMarketing" aria-invalid={!!errors.consentMarketing} aria-describedby={errors.consentMarketing ? "consentMarketing-error" : undefined} className="mt-0.5 size-5 flex-none accent-violet" />
          <span>Je veux être informé·e du lancement par e-mail (désinscription à tout moment).</span>
        </label>
        {err("consentMarketing")}
        <label className="flex cursor-pointer gap-3 rounded-xl p-1 text-[14px] leading-snug text-muted">
          <input type="checkbox" name="consentResearch" className="mt-0.5 size-5 flex-none accent-violet" />
          <span>Facultatif : je veux bien tester l’application.</span>
        </label>
      </div>

      {site.turnstileSiteKey && <Turnstile siteKey={site.turnstileSiteKey} onToken={(t) => (turnstileToken.current = t)} />}

      <button type="submit" disabled={sending} className="mt-5 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[16px] font-medium text-white shadow-[0_14px_30px_-12px_rgba(11,13,18,0.6)] transition-[background-color,transform] hover:bg-[#23262f] active:scale-[0.99] disabled:cursor-wait disabled:opacity-80">
        {sending ? (
          <>
            <Loader2 size={18} className="animate-spin motion-reduce:animate-none" aria-hidden /> Inscription en cours…
          </>
        ) : (
          "Rejoindre la waitlist"
        )}
      </button>
      <div aria-live="polite">{state.kind === "error" && <p className="mt-4 rounded-xl border border-stop/30 bg-stop/5 px-4 py-3 text-sm text-ink">{state.message}</p>}</div>
      <p className="mt-4 text-center text-[12.5px] leading-relaxed text-muted">
        Vos données ne servent qu’à vous informer du lancement, et ne sont ni vendues ni cédées. Conservation : {site.waitlist.retentionMonths} mois maximum.{" "}
        <a href="/confidentialite/" className="underline underline-offset-2 hover:text-ink">
          Confidentialité
        </a>
      </p>
    </form>
  );
}

const BURST = ["#6E4BFF", "#0E9F5A", "#E27A00", "#2E8BFF", "#E5364B", "#6E4BFF", "#0E9F5A", "#2E8BFF"];

/** Confirmation : la coche jaillit, entourée d'un éclat de pastilles. */
function Success({ already, firstName, link }: { already: boolean; firstName: string; link: string | null }) {
  const reduced = useReducedMotion();
  return (
    <div role="status" className="relative rounded-[28px] border border-line bg-white p-8 text-center shadow-[0_40px_80px_-40px_rgba(11,13,18,0.25)] sm:p-10">
      <div className="relative mx-auto grid size-20 place-items-center">
        {!reduced &&
          BURST.map((c, i) => {
            const a = (i / BURST.length) * Math.PI * 2;
            return (
              <motion.span
                key={i}
                aria-hidden
                className="absolute size-2.5 rounded-full"
                style={{ background: c }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 0.4 }}
                animate={{ x: Math.cos(a) * 70, y: Math.sin(a) * 70, opacity: 0, scale: 1 }}
                transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
              />
            );
          })}
        <motion.span
          className="grid size-20 place-items-center rounded-full bg-go text-white"
          initial={reduced ? false : { scale: 0, rotate: -40 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 14 }}
        >
          <Check size={40} strokeWidth={3} aria-hidden />
        </motion.span>
      </div>
      <h3 className="display mt-6 text-[2rem]">{already ? "Déjà inscrit·e !" : `Merci ${firstName} !`}</h3>
      <p className="mx-auto mt-3 max-w-[36ch] leading-relaxed text-muted">
        {already ? (
          "Cette adresse est déjà sur la waitlist. Vous recevrez les informations de lancement."
        ) : (
          <>
            C’est enregistré. Vous serez parmi les premiers informés du lancement en <span className="whitespace-nowrap">Île-de-France</span>.
          </>
        )}
      </p>
      {link && (
        <p className="mt-6 text-[13px] leading-relaxed text-muted">
          Conservez ce lien pour supprimer votre inscription à tout moment :{" "}
          <a className="font-medium text-violet underline underline-offset-4" href={link}>
            Supprimer mon inscription
          </a>
        </p>
      )}
    </div>
  );
}
