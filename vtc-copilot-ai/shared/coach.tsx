// Écrans « coach » de la démonstration : profil, contexte, pop-up de verdict, notifications.
// Pilotés par une progression p (0 → 1), sans hooks. Toutes les données sont fictives.

import type { CSSProperties, ReactNode } from "react";
import { Bell, Car, Check, CloudRain, Mic, Moon, Music2, Plane, Sparkles, TrafficCone, X } from "lucide-react";
import { C, VERDICT, easeOut, easeOutBack, fmtEUR, seg } from "./brand";
import type { Verdict } from "./brand";
import { DRIVER, estimate } from "./demo";
import type { Ride } from "./demo";
import { Card, DemoTag, Header, StatusBar, appear, tabular } from "./screens";

function CoachAvatar({ size = 34 }: { size?: number }) {
  return (
    <span style={{ width: size, height: size, borderRadius: size, flex: "none", display: "grid", placeItems: "center", background: `linear-gradient(135deg, ${C.violet}, ${C.blue})`, color: "#fff" }}>
      <Sparkles size={size * 0.5} aria-hidden />
    </span>
  );
}

function pop(t: number, from = 0.85): CSSProperties {
  const e = easeOutBack(t);
  return { opacity: Math.min(1, t * 3), transform: `scale(${from + (1 - from) * e})`, transformOrigin: "50% 100%" };
}

/* ------------------------------ 1. Profil avec le coach IA ------------------------------ */

const DRIVER_MSG = "J’ai un van et j’habite à Puteaux. J’aime travailler la nuit et je veux faire des courses aéroport.";

export function CoachScreen({ p }: { p: number }) {
  const typed = Math.round(DRIVER_MSG.length * seg(p, 0.14, 0.42));
  const thinking = p > 0.44 && p < 0.56;
  const rows: [ReactNode, string, string][] = [
    [<Car size={16} aria-hidden />, "Véhicule", DRIVER.vehicle],
    [<Sparkles size={16} aria-hidden />, "Base", DRIVER.base],
    [<Moon size={16} aria-hidden />, "Horaires", DRIVER.hours],
    [<Plane size={16} aria-hidden />, "Priorité", DRIVER.focus],
  ];
  return (
    <div style={{ position: "absolute", inset: 0, background: C.abyss }}>
      <StatusBar />
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 18px 12px", borderBottom: `1px solid ${C.line}` }}>
        <CoachAvatar />
        <div>
          <div style={{ fontSize: 17, fontWeight: 650 }}>Coach IA</div>
          <div style={{ fontSize: 12.5, color: C.muted }}>Votre profil de chauffeur</div>
        </div>
        <DemoTag style={{ marginLeft: "auto" }} />
      </div>

      <div style={{ padding: "16px 16px 0", display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end", ...pop(seg(p, 0, 0.1)) }}>
          <CoachAvatar size={26} />
          <span style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: "18px 18px 18px 6px", padding: "10px 14px", fontSize: 15, maxWidth: 270 }}>
            Bonjour ! Décrivez-moi votre activité.
          </span>
        </div>

        {typed > 0 && (
          <div style={{ alignSelf: "flex-end", background: C.ink, color: "#fff", borderRadius: "18px 18px 6px 18px", padding: "10px 14px", fontSize: 15, lineHeight: 1.4, maxWidth: 286 }}>
            {DRIVER_MSG.slice(0, typed)}
            {typed < DRIVER_MSG.length && <span style={{ opacity: 0.6 }}>|</span>}
          </div>
        )}

        {thinking && (
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            <CoachAvatar size={26} />
            <span style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 18, padding: "12px 16px", display: "flex", gap: 5 }}>
              {[0, 1, 2].map((i) => (
                <span key={i} style={{ width: 7, height: 7, borderRadius: 7, background: C.faint, opacity: 0.4 + 0.6 * Math.abs(Math.sin(p * 40 + i)) }} />
              ))}
            </span>
          </div>
        )}

        {p >= 0.56 && (
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start", ...pop(seg(p, 0.56, 0.66)) }}>
            <CoachAvatar size={26} />
            <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: "18px 18px 18px 6px", padding: "12px 14px", fontSize: 15, flex: 1 }}>
              Parfait {DRIVER.name}, votre profil est prêt :
              <div style={{ marginTop: 8 }}>
                {rows.map(([icon, k, v], i) => (
                  <div key={k} style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 0", borderTop: `1px solid ${C.line}`, ...appear(seg(p, 0.64 + i * 0.06, 0.74 + i * 0.06), 8) }}>
                    <span style={{ width: 28, height: 28, borderRadius: 9, display: "grid", placeItems: "center", background: "rgba(110,75,255,0.09)", color: C.violet }}>{icon}</span>
                    <span style={{ fontSize: 13.5, color: C.muted, flex: 1 }}>{k}</span>
                    <span style={{ fontSize: 14, fontWeight: 620 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ position: "absolute", left: 14, right: 14, bottom: 26, display: "flex", alignItems: "center", gap: 10, background: C.panel, border: `1px solid ${C.line}`, borderRadius: 22, padding: "8px 8px 8px 16px" }}>
        <span style={{ flex: 1, fontSize: 15, color: C.faint }}>Écrire au coach…</span>
        <span style={{ width: 36, height: 36, borderRadius: 36, display: "grid", placeItems: "center", background: C.ink, color: "#fff" }}>
          <Mic size={17} aria-hidden />
        </span>
      </div>
    </div>
  );
}

/* --------------------------------- 2. Contexte du moment --------------------------------- */

function Level({ label, level, t }: { label: string; level: 0 | 1 | 2; t: number }) {
  const color = [C.green, C.orange, C.red][level];
  const text = ["Fluide", "Chargé", "Dense"][level];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderTop: `1px solid ${C.line}`, ...appear(t, 8) }}>
      <span style={{ fontSize: 14, flex: 1 }}>{label}</span>
      <span style={{ width: 90, height: 6, borderRadius: 6, background: C.line, overflow: "hidden" }}>
        <span style={{ display: "block", height: "100%", width: `${(level + 1) * 33.3 * easeOut(t)}%`, background: color, borderRadius: 6 }} />
      </span>
      <span style={{ fontSize: 13, fontWeight: 620, color, width: 52, textAlign: "right" }}>{text}</span>
    </div>
  );
}

function Signal({ icon, color, title, detail, t }: { icon: ReactNode; color: string; title: string; detail: string; t: number }) {
  return (
    <Card style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 14px", ...appear(t) }}>
      <span style={{ width: 38, height: 38, borderRadius: 12, flex: "none", display: "grid", placeItems: "center", background: `${color}1a`, color }}>{icon}</span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 14.5, fontWeight: 620 }}>{title}</div>
        <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>{detail}</div>
      </div>
    </Card>
  );
}

export function ContextScreen({ p }: { p: number }) {
  return (
    <div style={{ position: "absolute", inset: 0, background: C.abyss }}>
      <StatusBar />
      <Header title="Contexte du moment" />
      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        <Card style={{ padding: "12px 16px 6px", ...appear(seg(p, 0, 0.12)) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: C.muted, paddingBottom: 6 }}>
            <TrafficCone size={16} color={C.orange} aria-hidden /> Trafic par secteur
          </div>
          <Level label="Paris 12e" level={2} t={seg(p, 0.08, 0.3)} />
          <Level label="Paris 16e" level={0} t={seg(p, 0.12, 0.34)} />
          <Level label="La Défense (92)" level={1} t={seg(p, 0.16, 0.38)} />
          <Level label="A1 vers CDG" level={1} t={seg(p, 0.2, 0.42)} />
        </Card>
        <Signal t={seg(p, 0.36, 0.5)} icon={<CloudRain size={19} aria-hidden />} color={C.blue} title="Pluie à partir de 22 h · 11 °C" detail="Demande en hausse attendue dans l’ouest parisien" />
        <Signal t={seg(p, 0.46, 0.6)} icon={<Plane size={19} aria-hidden />} color={C.orange} title="CDG terminal 2 : 3 vols annulés" detail="Moins de clients attendus à l’arrivée ce soir" />
        <Signal t={seg(p, 0.56, 0.7)} icon={<Music2 size={19} aria-hidden />} color={C.violet} title="Concert à Bercy, fin vers 23 h 30" detail="Sorties nombreuses, trafic dense dans le 12e" />
        <p style={{ fontSize: 12, color: C.faint, margin: "2px 4px", lineHeight: 1.45, ...appear(seg(p, 0.7, 0.82), 4) }}>
          Sources envisagées : trafic, météo, vols, événements. Exemple illustratif, aucune donnée réelle.
        </p>
      </div>
    </div>
  );
}

/* ------------------------- 3. Pop-up de verdict sur une proposition ------------------------- */

const OFFERS: { ride: Ride; verdict: Verdict; reasons: string[] }[] = [
  {
    ride: { id: "o1", platform: "Plateforme VTC", price: 58, approachKm: 3, approachMin: 9, tripKm: 31, tripMin: 41, from: "Puteaux (92)", to: "Aéroport CDG (95)" },
    verdict: "green",
    reasons: ["Aéroport", "Nuit", "Approche courte"],
  },
  {
    ride: { id: "o2", platform: "Plateforme VTC", price: 14, approachKm: 9, approachMin: 24, tripKm: 7, tripMin: 26, from: "Paris 12e", to: "Paris 20e" },
    verdict: "red",
    reasons: ["Trafic dense", "Approche longue"],
  },
  {
    ride: { id: "o3", platform: "Plateforme VTC", price: 27, approachKm: 5, approachMin: 12, tripKm: 15, tripMin: 31, returnKm: 10, returnMin: 18, from: "Neuilly (92)", to: "Saint-Denis (93)" },
    verdict: "orange",
    reasons: ["Retour à vide probable"],
  },
];

export function OverlayScreen({ p }: { p: number }) {
  const i = Math.min(OFFERS.length - 1, Math.floor(p * OFFERS.length));
  const local = p * OFFERS.length - i;
  const o = OFFERS[i];
  const e = estimate(o.ride);
  const v = VERDICT[o.verdict];
  const card = easeOutBack(seg(local, 0, 0.18));
  const badge = seg(local, 0.22, 0.42);

  return (
    <div style={{ position: "absolute", inset: 0, background: "#E9ECF1" }}>
      {/* carte routière neutre de l'application de la plateforme */}
      <svg width="390" height="844" viewBox="0 0 390 844" style={{ position: "absolute", inset: 0 }} aria-hidden>
        <g stroke="#FFFFFF" strokeWidth="14" fill="none" strokeLinecap="round">
          <path d="M-20 220 C 100 200 200 260 420 230" />
          <path d="M-20 420 C 120 450 260 380 420 410" />
          <path d="M120 -20 C 140 200 90 400 140 880" />
          <path d="M280 -20 C 260 240 320 500 290 880" />
        </g>
        <g stroke="#FFFFFF" strokeWidth="6" fill="none">
          <path d="M-20 320 L 420 300" />
          <path d="M200 -20 L 210 880" />
        </g>
      </svg>
      <StatusBar />
      <div style={{ position: "absolute", left: 195 - 10, top: 360, width: 20, height: 20, borderRadius: 20, background: C.ink, border: "4px solid #fff", boxShadow: "0 2px 10px rgba(0,0,0,0.2)" }} />

      {/* Pop-up VTC Copilot AI */}
      <div style={{ position: "absolute", left: 14, right: 14, top: 64, opacity: Math.min(1, badge * 2.5), transform: `translateY(${(1 - easeOutBack(badge)) * -40}px) scale(${0.85 + 0.15 * easeOutBack(badge)})` }}>
        <div style={{ background: "#fff", borderRadius: 24, padding: "14px 16px", boxShadow: `0 20px 40px -16px ${v.color}88, 0 0 0 2px ${v.color}`, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ width: 46, height: 46, borderRadius: 46, flex: "none", display: "grid", placeItems: "center", background: v.color, color: "#fff" }}>
            {o.verdict === "green" ? <Check size={26} strokeWidth={3} aria-hidden /> : o.verdict === "red" ? <X size={26} strokeWidth={3} aria-hidden /> : <span style={{ fontSize: 26, fontWeight: 800 }}>~</span>}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 21, fontWeight: 700, letterSpacing: "-0.02em" }}>{v.label}</div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>{o.reasons.join(" · ")}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: v.color, ...tabular }}>{fmtEUR(e.hourly, 0)}/h</div>
            <div style={{ fontSize: 11.5, color: C.muted }}>net estimé</div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: C.muted, background: "rgba(255,255,255,0.9)", padding: "3px 9px", borderRadius: 99 }}>VTC Copilot AI · données fictives</span>
        </div>
      </div>

      {/* Proposition de course (interface générique, aucune marque) */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, transform: `translateY(${(1 - card) * 320}px)` }}>
        <div style={{ background: C.ink, color: "#fff", borderRadius: "28px 28px 0 0", padding: "20px 22px 34px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(255,255,255,0.65)" }}>
            Demande de course
            <span style={{ marginLeft: "auto", fontWeight: 650, color: "#fff" }}>{o.ride.approachMin} min</span>
          </div>
          <div style={{ fontSize: 42, fontWeight: 700, letterSpacing: "-0.03em", marginTop: 6, ...tabular }}>{fmtEUR(o.ride.price)}</div>
          <div style={{ marginTop: 10, fontSize: 15, lineHeight: 1.6 }}>
            <div>● {o.ride.from}</div>
            <div>■ {o.ride.to}</div>
          </div>
          <div style={{ marginTop: 16, height: 52, borderRadius: 16, background: "#fff", color: C.ink, display: "grid", placeItems: "center", fontWeight: 700, fontSize: 17 }}>Accepter</div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- 4. Notifications du coach --------------------------------- */

const NOTIFS: { title: string; body: string; icon: ReactNode; color: string }[] = [
  { title: "Conseil du coach", body: `Bonjour ${DRIVER.name}, il y a trop de trafic aujourd’hui sur Paris 12e. Vous aurez plus de chances dans le 16e.`, icon: <TrafficCone size={17} aria-hidden />, color: C.orange },
  { title: "Vols annulés à CDG", body: "3 vols annulés au terminal 2 ce soir : moins de demande à l’arrivée. Orly reste actif jusqu’à minuit.", icon: <Plane size={17} aria-hidden />, color: C.red },
  { title: "Pluie à 22 h", body: "La demande devrait monter dans l’ouest parisien. Restez près de La Défense.", icon: <CloudRain size={17} aria-hidden />, color: C.blue },
];

export function NotifsScreen({ p }: { p: number }) {
  return (
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #EDE9FF 0%, #F7F7FB 45%, #FFFFFF 100%)" }}>
      <StatusBar />
      <div style={{ textAlign: "center", marginTop: 26 }}>
        <div style={{ fontSize: 15, color: C.muted, fontWeight: 550 }}>Vendredi 24 octobre</div>
        <div style={{ fontSize: 84, fontWeight: 650, letterSpacing: "-0.05em", lineHeight: 1, marginTop: 4, ...tabular }}>21:47</div>
        <DemoTag style={{ marginTop: 12 }} />
      </div>
      <div style={{ padding: "26px 12px 0", display: "flex", flexDirection: "column", gap: 10 }}>
        {NOTIFS.map((n, i) => {
          const t = seg(p, 0.1 + i * 0.24, 0.26 + i * 0.24);
          if (t <= 0) return null;
          return (
            <div key={n.title} style={{ background: "rgba(255,255,255,0.92)", border: `1px solid ${C.line}`, borderRadius: 22, padding: "12px 14px", boxShadow: "0 12px 30px -16px rgba(11,13,18,0.3)", ...pop(t, 0.7) }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CoachAvatar size={22} />
                <span style={{ fontSize: 12.5, fontWeight: 600, color: C.muted }}>VTC COPILOT AI</span>
                <span style={{ marginLeft: "auto", fontSize: 12, color: C.faint }}>{i === 0 ? "maintenant" : `il y a ${i * 4} min`}</span>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 8, alignItems: "flex-start" }}>
                <span style={{ width: 30, height: 30, borderRadius: 10, flex: "none", display: "grid", placeItems: "center", background: `${n.color}1a`, color: n.color }}>{n.icon}</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 650 }}>{n.title}</div>
                  <div style={{ fontSize: 14, lineHeight: 1.4, marginTop: 2 }}>{n.body}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", bottom: 30, left: 0, right: 0, display: "flex", justifyContent: "center", color: C.faint }}>
        <Bell size={18} aria-hidden />
      </div>
    </div>
  );
}
