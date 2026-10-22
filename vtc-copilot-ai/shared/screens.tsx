// Écrans de l'application VTC Copilot AI, pilotés par une progression p (0 → 1).
// Sans hooks : le site les anime avec Motion, le film avec l'horloge de Remotion.

import type { CSSProperties, ReactNode } from "react";
import {
  ArrowLeft,
  Check,
  Clock3,
  Gauge,
  Info,
  MapPin,
  Navigation,
  Route,
  SlidersHorizontal,
  TrafficCone,
  Undo2,
  Wallet,
} from "lucide-react";
import { C, VERDICT, easeOut, easeOutBack, fmtEUR, fmtKm, fmtMin, lerp, seg } from "./brand";
import { DEMO_COSTS, DEMO_PREFS, RIDE_MAIN, RIDE_MID, RIDE_TRAP, estimate } from "./demo";
import type { Ride } from "./demo";

const MAIN = estimate(RIDE_MAIN);

/* ---------------------------------- primitives ---------------------------------- */

const tabular: CSSProperties = { fontVariantNumeric: "tabular-nums" };

function StatusBar() {
  return (
    <div
      style={{
        height: 54,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "6px 30px 0",
        fontSize: 15,
        fontWeight: 600,
        ...tabular,
      }}
    >
      <span>08:12</span>
      <span style={{ display: "flex", gap: 5, alignItems: "flex-end" }} aria-hidden>
        {[6, 9, 12, 15].map((h) => (
          <span key={h} style={{ width: 3.5, height: h, borderRadius: 2, background: C.text }} />
        ))}
        <span style={{ width: 24, height: 12, borderRadius: 4, border: `1.5px solid ${C.text}`, marginLeft: 6, position: "relative" }}>
          <span style={{ position: "absolute", inset: 1.5, right: 6, borderRadius: 2, background: C.text }} />
        </span>
      </span>
    </div>
  );
}

export function DemoTag({ style }: { style?: CSSProperties }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: 11.5,
        fontWeight: 600,
        color: C.muted,
        padding: "4px 9px",
        borderRadius: 999,
        border: `1px solid ${C.line}`,
        background: "rgba(255,255,255,0.03)",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      <Info size={12} strokeWidth={2.2} aria-hidden />
      Données fictives
    </span>
  );
}

function Header({ title, back = false }: { title: string; back?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 22px 14px" }}>
      {back && (
        <span
          style={{
            width: 34,
            height: 34,
            borderRadius: 12,
            display: "grid",
            placeItems: "center",
            background: C.panel,
            border: `1px solid ${C.line}`,
          }}
        >
          <ArrowLeft size={17} aria-hidden />
        </span>
      )}
      <span style={{ fontSize: 19, fontWeight: 700, fontStretch: "112%", letterSpacing: "-0.01em" }}>{title}</span>
      <DemoTag style={{ marginLeft: "auto" }} />
    </div>
  );
}

function Card({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        background: `linear-gradient(180deg, ${C.panelHi} 0%, ${C.panel} 100%)`,
        border: `1px solid ${C.line}`,
        borderRadius: 22,
        padding: 16,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function appear(t: number, dy = 14): CSSProperties {
  const e = easeOut(t);
  return { opacity: e, transform: `translateY(${(1 - e) * dy}px)` };
}

function Row({ icon, label, value, t, accent }: { icon: ReactNode; label: string; value: string; t: number; accent?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderTop: `1px solid ${C.line}`, ...appear(t) }}>
      <span
        style={{
          width: 34,
          height: 34,
          flex: "none",
          borderRadius: 11,
          display: "grid",
          placeItems: "center",
          background: "rgba(124,92,255,0.14)",
          color: accent ?? C.violetSoft,
        }}
      >
        {icon}
      </span>
      <span style={{ fontSize: 14.5, color: C.muted, flex: 1, minWidth: 0 }}>{label}</span>
      <span style={{ fontSize: 15.5, fontWeight: 650, color: accent ?? C.text, whiteSpace: "nowrap", ...tabular }}>{value}</span>
    </div>
  );
}

function CityLines({ opacity = 1 }: { opacity?: number }) {
  // trame de rues stylisée, purement décorative
  return (
    <svg width="390" height="844" viewBox="0 0 390 844" style={{ position: "absolute", inset: 0, opacity }} aria-hidden>
      <g stroke="rgba(130,150,255,0.09)" strokeWidth="1.2" fill="none">
        <path d="M-20 160 C 80 140 160 210 260 190 S 380 120 420 140" />
        <path d="M-20 300 C 90 330 170 260 250 300 S 360 380 420 350" />
        <path d="M-20 470 C 120 430 200 520 300 480 S 380 440 420 460" />
        <path d="M-20 640 C 100 610 210 690 300 650 S 380 600 420 620" />
        <path d="M60 -20 C 90 120 40 260 90 420 S 60 700 100 880" />
        <path d="M190 -20 C 170 140 230 300 200 460 S 230 700 190 880" />
        <path d="M320 -20 C 300 160 350 330 310 500 S 340 720 320 880" />
      </g>
      <path d="M-20 560 C 80 520 140 600 220 560 S 340 500 420 540" stroke="rgba(56,182,255,0.16)" strokeWidth="9" fill="none" />
    </svg>
  );
}

/* --------------------------------- 1. Réception --------------------------------- */

export function OfferScreen({ p, ride = RIDE_MAIN }: { p: number; ride?: Ride }) {
  const arrive = easeOutBack(seg(p, 0.02, 0.24));
  const expand = easeOut(seg(p, 0.24, 0.5));
  const timer = 1 - seg(p, 0.1, 1) * 0.72;
  const analyse = seg(p, 0.62, 0.97);
  const ringLen = 2 * Math.PI * 15;
  const pulse = 0.5 + 0.5 * Math.sin(p * Math.PI * 6);

  return (
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(120% 70% at 50% 0%, #142057 0%, ${C.night} 60%)` }}>
      <CityLines />
      <StatusBar />
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "2px 22px", fontSize: 14, color: C.muted }}>
        <span style={{ width: 8, height: 8, borderRadius: 9, background: C.green, boxShadow: `0 0 12px ${C.green}` }} />
        En service · Paris 10e
        <DemoTag style={{ marginLeft: "auto" }} />
      </div>

      {/* position du chauffeur */}
      <div style={{ position: "absolute", left: 195 - 9, top: 640, width: 18, height: 18 }} aria-hidden>
        <span style={{ position: "absolute", inset: -22 * pulse, borderRadius: 99, background: C.blue, opacity: 0.18 * (1 - pulse) + 0.05 }} />
        <span style={{ position: "absolute", inset: 0, borderRadius: 99, background: C.blue, border: "3px solid #fff" }} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 16,
          right: 16,
          top: 100,
          transform: `translateY(${lerp(-260, 0, arrive)}px)`,
          opacity: seg(p, 0.02, 0.1),
        }}
      >
        <Card style={{ padding: 18, boxShadow: `0 24px 60px -24px ${C.violet}aa`, borderColor: C.lineStrong }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                fontSize: 12.5,
                fontWeight: 700,
                color: C.night,
                background: C.blue,
                borderRadius: 999,
                padding: "4px 10px",
              }}
            >
              Nouvelle proposition
            </span>
            <span style={{ fontSize: 13, color: C.muted, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {ride.platform}
            </span>
            <svg width="36" height="36" viewBox="0 0 36 36" style={{ marginLeft: "auto", flex: "none" }} aria-hidden>
              <circle cx="18" cy="18" r="15" stroke={C.line} strokeWidth="3" fill="none" />
              <circle
                cx="18"
                cy="18"
                r="15"
                stroke={timer > 0.4 ? C.blue : C.orange}
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={ringLen}
                strokeDashoffset={ringLen * (1 - timer)}
                transform="rotate(-90 18 18)"
              />
              <text x="18" y="22.5" textAnchor="middle" fontSize="12" fontWeight="700" fill={C.text} style={tabular}>
                {Math.ceil(timer * 15)}
              </text>
            </svg>
          </div>

          <div style={{ marginTop: 14, display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{ fontSize: 46, fontWeight: 760, fontStretch: "118%", letterSpacing: "-0.02em", ...tabular }}>
              {fmtEUR(ride.price)}
            </span>
            <span style={{ fontSize: 14, color: C.muted }}>prix proposé</span>
          </div>

          <div style={{ overflow: "hidden", maxHeight: 220 * expand, marginTop: 6 * expand }}>
            <Row t={seg(p, 0.28, 0.42)} icon={<Navigation size={17} aria-hidden />} label="Approche" value={`${fmtKm(ride.approachKm)} · ${fmtMin(ride.approachMin)}`} />
            <Row t={seg(p, 0.33, 0.47)} icon={<MapPin size={17} aria-hidden />} label="Destination" value={ride.to} />
            <Row t={seg(p, 0.38, 0.52)} icon={<Clock3 size={17} aria-hidden />} label="Course estimée" value={`${fmtMin(ride.tripMin)} · ${fmtKm(ride.tripKm)}`} />
          </div>
        </Card>
      </div>

      <div style={{ position: "absolute", left: 16, right: 16, bottom: 34, ...appear(seg(p, 0.55, 0.68), 30) }}>
        <Card style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px" }}>
          <span
            style={{
              width: 40,
              height: 40,
              borderRadius: 13,
              display: "grid",
              placeItems: "center",
              background: `linear-gradient(135deg, ${C.violet}, ${C.blue})`,
            }}
          >
            <Gauge size={20} color="#fff" aria-hidden />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 650 }}>{analyse < 1 ? "Copilot analyse la course…" : "Analyse prête"}</div>
            <div style={{ marginTop: 8, height: 5, borderRadius: 5, background: C.line, overflow: "hidden" }}>
              <div
                style={{
                  width: `${analyse * 100}%`,
                  height: "100%",
                  borderRadius: 5,
                  background: `linear-gradient(90deg, ${C.violet}, ${C.blue})`,
                }}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ----------------------------------- 2. Analyse ----------------------------------- */

export function AnalysisScreen({ p }: { p: number }) {
  const ride = RIDE_MAIN;
  const bar = easeOut(seg(p, 0.12, 0.5));
  const count = easeOut(seg(p, 0.45, 0.85));
  const costShare = MAIN.costs / ride.price;
  const v = VERDICT[MAIN.verdict];

  return (
    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, #0D1640 0%, ${C.night} 55%)` }}>
      <StatusBar />
      <Header title="Analyse" back />

      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 12 }}>
        <Card style={appear(seg(p, 0, 0.14))}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontSize: 14, color: C.muted }}>Prix proposé</span>
            <span style={{ fontSize: 13, color: C.muted }}>
              {ride.from} → Orly
            </span>
          </div>
          <div style={{ fontSize: 38, fontWeight: 760, fontStretch: "118%", marginTop: 4, ...tabular }}>{fmtEUR(ride.price)}</div>

          {/* décomposition du prix */}
          <div style={{ marginTop: 14, height: 14, borderRadius: 8, background: C.line, display: "flex", overflow: "hidden" }}>
            <div style={{ width: `${costShare * 100 * bar}%`, background: C.orange }} />
            <div style={{ width: `${(1 - costShare) * 100 * bar}%`, background: C.green, marginLeft: 2 }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 12.5, color: C.muted, ...appear(seg(p, 0.35, 0.5), 6) }}>
            <span>
              <span style={{ color: C.orange }}>■</span> Coûts estimés {fmtEUR(MAIN.costs)}
            </span>
            <span>
              <span style={{ color: C.green }}>■</span> Net estimé {fmtEUR(MAIN.net)}
            </span>
          </div>
        </Card>

        <Card style={{ padding: "6px 16px", ...appear(seg(p, 0.12, 0.26)) }}>
          <Row t={seg(p, 0.16, 0.3)} icon={<Clock3 size={17} aria-hidden />} label="Temps total mobilisé" value={fmtMin(MAIN.totalMin)} />
          <Row t={seg(p, 0.22, 0.36)} icon={<Route size={17} aria-hidden />} label="Distance totale" value={fmtKm(MAIN.totalKm)} />
          <Row
            t={seg(p, 0.28, 0.42)}
            icon={<SlidersHorizontal size={17} aria-hidden />}
            label={`Vos coûts (${fmtEUR(DEMO_COSTS.perKm)}/km)`}
            value={`− ${fmtEUR(MAIN.costs)}`}
            accent={C.orange}
          />
          <Row t={seg(p, 0.34, 0.48)} icon={<Wallet size={17} aria-hidden />} label="Estimation nette" value={fmtEUR(MAIN.net)} />
        </Card>

        <Card style={{ display: "flex", alignItems: "center", gap: 14, borderColor: `${v.color}55`, ...appear(seg(p, 0.45, 0.6)) }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, color: C.muted }}>Taux horaire net estimé</div>
            <div style={{ fontSize: 34, fontWeight: 760, fontStretch: "115%", color: v.color, ...tabular }}>
              {fmtEUR(MAIN.hourly * count)}
              <span style={{ fontSize: 17, fontWeight: 600 }}>/h</span>
            </div>
          </div>
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: C.night,
              background: v.color,
              padding: "6px 11px",
              borderRadius: 999,
              opacity: seg(p, 0.8, 0.92),
            }}
          >
            {v.label}
          </span>
        </Card>

        <p style={{ fontSize: 12, color: C.faint, lineHeight: 1.45, margin: "2px 4px", ...appear(seg(p, 0.7, 0.85), 4) }}>
          Calcul illustratif : prix proposé − (distance totale × coût par km), rapporté au temps total mobilisé.
        </p>
      </div>
    </div>
  );
}

/* --------------------------------- 3. Destination --------------------------------- */

const ROUTE = "M214 176 C 230 206 236 232 222 262 S 196 316 204 352 S 214 392 206 418";
const ROUTE_LEN = 270;

export function MapScreen({ p }: { p: number }) {
  const route = easeOut(seg(p, 0.12, 0.55));
  const pin = easeOutBack(seg(p, 0.5, 0.64));
  const dept: [string, number, number][] = [
    ["75", 196, 214],
    ["92", 140, 236],
    ["93", 262, 168],
    ["94", 262, 300],
    ["95", 170, 96],
    ["78", 70, 250],
    ["91", 170, 400],
    ["77", 330, 268],
  ];

  return (
    <div style={{ position: "absolute", inset: 0, background: C.night }}>
      <StatusBar />
      <Header title="Destination" back />

      <div style={{ position: "relative", margin: "0 16px", height: 452, borderRadius: 24, overflow: "hidden", border: `1px solid ${C.line}`, background: "#081032" }}>
        <svg width="358" height="452" viewBox="0 0 390 480" aria-hidden style={{ display: "block", width: "100%", height: "100%" }}>
          <defs>
            <linearGradient id="routeG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={C.blue} />
              <stop offset="1" stopColor={C.violet} />
            </linearGradient>
            <radialGradient id="mapGlow" cx="0.5" cy="0.45" r="0.6">
              <stop offset="0" stopColor="#1A2A6E" />
              <stop offset="1" stopColor="#081032" />
            </radialGradient>
          </defs>
          <rect width="390" height="480" fill="url(#mapGlow)" />
          {/* Île-de-France stylisée : grande couronne, A86, périphérique */}
          <path
            d="M40 170 C 30 90 120 30 210 34 S 370 80 372 190 S 330 420 220 448 S 50 420 34 320 Z"
            fill="rgba(124,92,255,0.07)"
            stroke="rgba(160,172,255,0.30)"
            strokeWidth="1.4"
            strokeDasharray="4 5"
          />
          <ellipse cx="206" cy="232" rx="104" ry="92" fill="none" stroke="rgba(160,172,255,0.20)" strokeWidth="1.2" />
          <ellipse cx="204" cy="214" rx="44" ry="34" fill="rgba(56,182,255,0.10)" stroke="rgba(160,172,255,0.45)" strokeWidth="1.6" />
          {/* la Seine */}
          <path d="M20 160 C 90 200 120 140 170 210 S 250 230 268 280 S 330 330 380 340" stroke="rgba(56,182,255,0.35)" strokeWidth="5" fill="none" strokeLinecap="round" />
          {dept.map(([n, x, y]) => (
            <text key={n} x={x} y={y} fontSize="13" fontWeight="700" fill="rgba(234,237,255,0.38)" textAnchor="middle">
              {n}
            </text>
          ))}
          {/* trajet */}
          <path d={ROUTE} stroke="rgba(0,0,0,0.35)" strokeWidth="9" fill="none" strokeLinecap="round" />
          <path
            d={ROUTE}
            stroke="url(#routeG)"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={ROUTE_LEN}
            strokeDashoffset={ROUTE_LEN * (1 - route)}
          />
          <circle cx="214" cy="176" r="8" fill={C.blue} stroke="#fff" strokeWidth="3" opacity={seg(p, 0.05, 0.12)} />
          <g style={{ transformBox: "fill-box", transformOrigin: "50% 100%", transform: `scale(${pin})` }}>
            <path d="M206 420 c -12 -14 -18 -22 -18 -31 a 18 18 0 1 1 36 0 c 0 9 -6 17 -18 31 z" fill={C.violet} stroke="#fff" strokeWidth="2.5" />
            <circle cx="206" cy="389" r="6" fill="#fff" />
          </g>
          {/* pôle aéroportuaire (point d'intérêt) */}
          <g opacity={seg(p, 0.62, 0.74)}>
            <circle cx="206" cy="389" r={34 + 6 * seg(p, 0.62, 0.9)} fill="none" stroke="rgba(43,217,154,0.45)" strokeDasharray="3 4" />
          </g>
        </svg>

        <div style={{ position: "absolute", left: 14, top: 14, ...appear(seg(p, 0.08, 0.2), 8) }}>
          <span style={{ fontSize: 12.5, fontWeight: 650, background: "rgba(5,9,24,0.78)", border: `1px solid ${C.line}`, padding: "6px 10px", borderRadius: 10 }}>
            Départ · Paris 10e
          </span>
        </div>
        <div style={{ position: "absolute", right: 14, bottom: 14, ...appear(seg(p, 0.58, 0.7), 8) }}>
          <span style={{ fontSize: 12.5, fontWeight: 650, background: "rgba(5,9,24,0.78)", border: `1px solid ${C.line}`, padding: "6px 10px", borderRadius: 10 }}>
            Arrivée · Aéroport d’Orly (94)
          </span>
        </div>
      </div>

      <div style={{ padding: "12px 16px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <MiniStat t={seg(p, 0.55, 0.68)} icon={<Clock3 size={16} aria-hidden />} label="Durée estimée" value={fmtMin(RIDE_MAIN.tripMin)} />
        <MiniStat t={seg(p, 0.6, 0.73)} icon={<Route size={16} aria-hidden />} label="Distance" value={fmtKm(RIDE_MAIN.tripKm)} />
        <MiniStat t={seg(p, 0.66, 0.8)} icon={<Undo2 size={16} aria-hidden />} label="Retour" value="Pôle aéroport, à évaluer" small />
        <MiniStat t={seg(p, 0.72, 0.86)} icon={<TrafficCone size={16} aria-hidden />} label="Circulation" value="Non connectée (démo)" small />
      </div>
    </div>
  );
}

function MiniStat({ icon, label, value, t, small }: { icon: ReactNode; label: string; value: string; t: number; small?: boolean }) {
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 18, padding: "11px 13px", ...appear(t, 10) }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: C.muted }}>
        <span style={{ color: C.violetSoft, display: "flex" }}>{icon}</span>
        {label}
      </div>
      <div style={{ fontSize: small ? 13.5 : 18, fontWeight: 680, marginTop: 4, lineHeight: 1.25, ...tabular }}>{value}</div>
    </div>
  );
}

/* --------------------------------- 4. Recommandation --------------------------------- */

const RING_R = 78;
const RING_LEN = 2 * Math.PI * RING_R * 0.75;

export function VerdictScreen({ p }: { p: number }) {
  const fill = easeOut(seg(p, 0.08, 0.5));
  const score = Math.min(1, MAIN.hourly / 45);
  const v = VERDICT[MAIN.verdict];
  const settled = seg(p, 0.45, 0.6);
  const ringColor = settled > 0 ? v.color : C.blue;

  const others = [RIDE_MID, RIDE_TRAP].map((r) => ({ r, e: estimate(r) }));

  return (
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(90% 50% at 50% 22%, ${v.color}22 0%, ${C.night} 70%)` }}>
      <StatusBar />
      <Header title="Recommandation" />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <svg width="200" height="176" viewBox="0 0 200 176" aria-hidden>
          <g transform="rotate(135 100 100)">
            <circle cx="100" cy="100" r={RING_R} fill="none" stroke={C.line} strokeWidth="13" strokeLinecap="round" strokeDasharray={`${RING_LEN} 999`} />
            <circle
              cx="100"
              cy="100"
              r={RING_R}
              fill="none"
              stroke={ringColor}
              strokeWidth="13"
              strokeLinecap="round"
              strokeDasharray={`${RING_LEN * score * fill} 999`}
              style={{ filter: `drop-shadow(0 0 10px ${ringColor}88)` }}
            />
          </g>
          <text x="100" y="98" textAnchor="middle" fontSize="30" fontWeight="760" fill={C.text} style={{ ...tabular, fontStretch: "112%" }}>
            {fmtEUR(MAIN.hourly * fill, 0)}/h
          </text>
          <text x="100" y="122" textAnchor="middle" fontSize="13" fill={C.muted}>
            net estimé
          </text>
        </svg>
        <span
          style={{
            marginTop: -6,
            fontSize: 15,
            fontWeight: 720,
            color: C.night,
            background: v.color,
            padding: "7px 14px",
            borderRadius: 999,
            transform: `scale(${0.6 + 0.4 * easeOutBack(settled)})`,
            opacity: settled,
          }}
        >
          {v.label}
        </span>
      </div>

      <div style={{ padding: "16px 16px 0", display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          `Approche courte : ${fmtMin(RIDE_MAIN.approachMin)}`,
          `Au-dessus de votre seuil (${DEMO_PREFS.greenFrom} €/h)`,
          "Retour depuis l’aéroport à évaluer",
        ].map((txt, i) => (
          <div key={txt} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14.5, ...appear(seg(p, 0.55 + i * 0.06, 0.68 + i * 0.06), 8) }}>
            <span style={{ width: 22, height: 22, borderRadius: 8, display: "grid", placeItems: "center", background: i < 2 ? `${C.green}26` : `${C.orange}26`, color: i < 2 ? C.green : C.orange }}>
              {i < 2 ? <Check size={14} strokeWidth={3} aria-hidden /> : <Info size={14} strokeWidth={2.6} aria-hidden />}
            </span>
            {txt}
          </div>
        ))}
      </div>

      <div style={{ padding: "16px 16px 0", display: "flex", flexDirection: "column", gap: 7, ...appear(seg(p, 0.7, 0.84), 10) }}>
        {others.map(({ r, e }) => (
          <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, background: C.panel, border: `1px solid ${C.line}`, borderRadius: 14, padding: "9px 12px", fontSize: 13.5 }}>
            <span style={{ width: 9, height: 9, borderRadius: 9, background: VERDICT[e.verdict].color, flex: "none" }} />
            <span style={{ color: C.muted, flex: 1, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {fmtEUR(r.price)} · {r.to}
            </span>
            <span style={{ fontWeight: 650, color: VERDICT[e.verdict].color, whiteSpace: "nowrap" }}>{VERDICT[e.verdict].label}</span>
          </div>
        ))}
      </div>

      <div style={{ position: "absolute", left: 16, right: 16, bottom: 30, ...appear(seg(p, 0.8, 0.95), 20) }}>
        <div style={{ display: "flex", gap: 10 }}>
          <span style={{ flex: 1, textAlign: "center", padding: "15px 0", borderRadius: 18, border: `1px solid ${C.lineStrong}`, fontWeight: 650, fontSize: 16 }}>Ignorer</span>
          <span style={{ flex: 1.4, textAlign: "center", padding: "15px 0", borderRadius: 18, background: C.green, color: C.night, fontWeight: 760, fontSize: 16 }}>Accepter</span>
        </div>
        <div style={{ textAlign: "center", fontSize: 12.5, color: C.muted, marginTop: 10 }}>Le copilote éclaire, vous décidez.</div>
      </div>
    </div>
  );
}
