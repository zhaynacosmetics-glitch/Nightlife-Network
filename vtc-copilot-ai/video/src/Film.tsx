// Film motion design « VTC Copilot AI » — 20 s, 1920×1080, 30 i/s, muet.
// Scénario « Am, stram, gram ? » : ../SCENARIO.md · timecodes : ../STORYBOARD.md

import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Easing, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/fonts";
import { Car, Check, Clock3, CloudRain, Fuel, Music2, Navigation, SlidersHorizontal, Ticket, TrafficCone, TrendingUp, Undo2, Users, Wallet, X } from "lucide-react";
import { C, FONT, VERDICT, fmtEUR, type Verdict } from "../../shared/brand";
import { RIDE_TRAP, estimate } from "../../shared/demo";
import { LogoMark } from "../../shared/Logo";
import { Phone } from "../../shared/Phone";
import { OverlayScreen } from "../../shared/coach";

for (const file of ["geist-latin-wght-normal.woff2", "geist-latin-ext-wght-normal.woff2"]) {
  loadFont({ family: "Geist Variable", url: staticFile(`fonts/${file}`), weight: "100 900", display: "block" });
}

const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const INOUT = Easing.bezier(0.65, 0, 0.35, 1);
const BACK = Easing.bezier(0.34, 1.56, 0.64, 1);
const BIGBACK = Easing.bezier(0.3, 2.1, 0.5, 1);

/** interpolate() bornée, avec easing. */
const ip = (f: number, range: [number, number], out: [number, number], easing = OUT) =>
  interpolate(f, range, out, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

const tab: CSSProperties = { fontVariantNumeric: "tabular-nums" };
const TRAP = estimate(RIDE_TRAP);
const halo = "0 0 40px #fff, 0 0 18px #fff, 0 0 6px #fff";

/* ------------------------------------------------------------------ décor commun */

function Backdrop({ tint, tint2, drift = 0 }: { tint: string; tint2: string; drift?: number }) {
  return (
    <AbsoluteFill style={{ background: C.night }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(60% 70% at ${30 + drift * 12}% ${35 - drift * 8}%, ${tint}1f 0%, transparent 70%), radial-gradient(55% 60% at ${78 - drift * 10}% ${70 + drift * 6}%, ${tint2}18 0%, transparent 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: "linear-gradient(rgba(15,18,30,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(15,18,30,0.045) 1px, transparent 1px)",
          backgroundSize: "96px 96px",
          maskImage: "radial-gradient(80% 80% at 50% 50%, black 30%, transparent 85%)",
        }}
      />
    </AbsoluteFill>
  );
}

function DemoNotice({ opacity = 1, right = false }: { opacity?: number; right?: boolean }) {
  return (
    <div style={{ position: "absolute", [right ? "right" : "left"]: 80, bottom: 56, fontSize: 24, fontWeight: 500, color: C.muted, opacity, letterSpacing: "0.01em" }}>
      Exemple illustratif · données fictives
    </div>
  );
}

/** Mot qui jaillit d'un coup (ressort), puis reste. */
function Pop({ at, children, size = 120, color = C.text, style }: { at: number; children: ReactNode; size?: number; color?: string; style?: CSSProperties }) {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        fontSize: size,
        fontWeight: 680,
        letterSpacing: "-0.05em",
        lineHeight: 1,
        color,
        whiteSpace: "nowrap",
        textShadow: halo,
        opacity: ip(f, [at, at + 3], [0, 1], Easing.linear),
        scale: ip(f, [at, at + 10], [0.3, 1], BIGBACK),
        rotate: `${ip(f, [at, at + 10], [-8, 0])}deg`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Sparkle({ size = 60, color = C.orange, style }: { size?: number; color?: string; style?: CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ position: "absolute", ...style }} aria-hidden>
      <path d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0 Z" fill={color} />
    </svg>
  );
}

function OfferToast({ price, dest, timer, width = 420 }: { price: number; dest: string; timer: number; width?: number }) {
  return (
    <div
      style={{
        width,
        borderRadius: 28,
        padding: "22px 26px",
        background: "#fff",
        border: `1.5px solid ${C.line}`,
        boxShadow: "0 40px 70px -34px rgba(11,13,18,0.38), 0 8px 20px -10px rgba(11,13,18,0.15)",
        color: C.text,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 20, color: C.muted }}>
        <span style={{ background: C.ink, color: "#fff", fontWeight: 650, padding: "5px 13px", borderRadius: 99, fontSize: 18 }}>Nouvelle course</span>
        {dest}
      </div>
      <div style={{ fontSize: 64, fontWeight: 680, marginTop: 8, letterSpacing: "-0.04em", ...tab }}>{fmtEUR(price, 0)}</div>
      <div style={{ marginTop: 12, height: 7, borderRadius: 7, background: C.line, overflow: "hidden" }}>
        <div style={{ width: `${timer * 100}%`, height: "100%", background: timer > 0.35 ? C.blue : C.orange, borderRadius: 7 }} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ 0 → 3,3 s : la comptine */

const RAIN = [
  { at: 0, x: 110, y: 110, r: -5, price: 18, dest: "Paris 11e" },
  { at: 5, x: 1390, y: 130, r: 4, price: 41, dest: "Roissy (95)" },
  { at: 9, x: 150, y: 700, r: 3, price: 12, dest: "Paris 3e" },
  { at: 13, x: 1360, y: 690, r: -3, price: 27, dest: "Créteil (94)" },
  { at: 17, x: 760, y: 70, r: 2, price: 23, dest: "Nanterre (92)" },
  { at: 21, x: 760, y: 780, r: -2, price: 15, dest: "Paris 18e" },
];
// le doigt saute d'une proposition à l'autre, au rythme de la comptine
const HOPS = [
  { at: 18, toast: 0, word: "Am." },
  { at: 38, toast: 3, word: "Stram." },
  { at: 58, toast: 1, word: "Gram." },
];

function SceneRhyme() {
  const f = useCurrentFrame();
  const blur = ip(f, [70, 84], [0, 6]);
  const exit = ip(f, [92, 100], [0, 1], INOUT);
  const center = (i: number) => ({ x: RAIN[i].x + 210, y: RAIN[i].y + 95 });

  // position du doigt : saut en arc entre deux propositions
  let hx = 960;
  let hy = 1200;
  for (let k = 0; k < HOPS.length; k++) {
    const from = k === 0 ? { x: 960, y: 1200 } : center(HOPS[k - 1].toast);
    const to = center(HOPS[k].toast);
    const t = ip(f, [HOPS[k].at - 10, HOPS[k].at], [0, 1], INOUT);
    if (f >= HOPS[k].at - 10) {
      hx = from.x + (to.x - from.x) * t;
      hy = from.y + (to.y - from.y) * t - Math.sin(t * Math.PI) * 220;
    }
  }
  const lastHop = [...HOPS].reverse().find((h) => f >= h.at);
  const tapAge = lastHop ? f - lastHop.at : 99;

  return (
    <AbsoluteFill style={{ opacity: 1 - exit, scale: 1 + exit * 0.08 }}>
      <Backdrop tint={C.blue} tint2={C.violet} drift={f / 100} />
      <AbsoluteFill style={{ filter: `blur(${blur}px)`, opacity: 1 - blur / 12 }}>
        {RAIN.map((t, i) => {
          const fall = ip(f, [t.at, t.at + 14], [-700, 0], BACK);
          const picked = HOPS.find((h) => h.toast === i && f >= h.at);
          const bump = picked ? interpolate(f, [picked.at, picked.at + 3, picked.at + 9], [1, 1.08, 1], { extrapolateRight: "clamp" }) : 1;
          return (
            <div key={i} style={{ position: "absolute", left: t.x, top: t.y, translate: `0 ${fall}px`, rotate: `${t.r + Math.sin((f + i * 9) / 9) * 1.2}deg`, scale: bump }}>
              <OfferToast price={t.price} dest={t.dest} timer={ip(f, [t.at, t.at + 100], [1, 0.12], Easing.linear)} />
            </div>
          );
        })}
        {/* le doigt (point qui pulse) */}
        <div style={{ position: "absolute", left: hx - 30, top: hy - 30, width: 60, height: 60, borderRadius: 60, background: C.violet, border: "6px solid #fff", boxShadow: "0 12px 30px -8px rgba(110,75,255,0.7)", scale: 1 - Math.max(0, 0.25 - tapAge * 0.05) }} />
        {tapAge < 12 && (
          <div style={{ position: "absolute", left: hx - 30, top: hy - 30, width: 60, height: 60, borderRadius: 60, border: `4px solid ${C.violet}`, opacity: 1 - tapAge / 12, scale: 1 + tapAge / 3 }} />
        )}
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        {HOPS.map((h, k) => {
          const next = HOPS[k + 1]?.at ?? 72;
          const vis = f >= h.at && f < next;
          return vis ? (
            <div key={h.word} style={{ position: "absolute" }}>
              <Pop at={h.at} size={210} color={k === 2 ? C.violet : C.text}>
                {h.word}
              </Pop>
            </div>
          ) : null;
        })}
        {f >= 72 && <Pop at={72} size={124}>Vous choisissez au hasard ?</Pop>}
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ 3,3 → 8 s : le ballon qui se dégonfle */

const PINS = [
  { at: 30, icon: <Navigation size={32} />, label: "Approche", value: `${RIDE_TRAP.approachMin} min`, color: C.orange },
  { at: 44, icon: <Undo2 size={32} />, label: "Retour à vide", value: `${RIDE_TRAP.returnMin ?? 0} min`, color: C.red },
  { at: 58, icon: <Fuel size={32} />, label: "Carburant et usure", value: `− ${fmtEUR(TRAP.costs)}`, color: C.red },
];

function SceneBalloon() {
  const f = useCurrentFrame();
  const enter = ip(f, [0, 12], [0, 1]);
  const deflate = ip(f, [70, 100], [0, 1], Easing.in(Easing.quad));
  const wobble = f >= 70 && f < 100 ? Math.sin(f * 2.1) * 9 * (1 - deflate) : 0;
  const pinJolt = PINS.reduce((s, p) => s + (f >= p.at && f < p.at + 6 ? (6 - (f - p.at)) * 2 : 0), 0);
  const hourly = ip(f, [84, 108], [RIDE_TRAP.price, TRAP.hourly], Easing.out(Easing.cubic));
  const exit = ip(f, [132, 140], [0, 1], INOUT);

  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <Backdrop tint={deflate > 0.3 ? C.red : C.orange} tint2={C.violet} drift={0.4 + f / 200} />

      {/* la course « jackpot » */}
      <div style={{ position: "absolute", left: 160, top: 210, width: 820, height: 520 }}>
        <div style={{ position: "absolute", left: 0, top: 0 }}>
          <Pop at={10} size={84} color={C.orange} style={{ opacity: f < 70 ? 1 : 1 - ip(f, [70, 78], [0, 1]) }}>
            Jackpot ?
          </Pop>
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 110,
            fontSize: 330,
            fontWeight: 720,
            letterSpacing: "-0.07em",
            lineHeight: 1,
            color: deflate > 0.5 ? C.red : C.text,
            transformOrigin: "30% 60%",
            opacity: enter * (1 - ip(f, [92, 100], [0, 1])),
            scale: `${ip(f, [0, 12], [0.6, 1], BIGBACK) * (1 - deflate * 0.75) * (1 + pinJolt / 200)} ${ip(f, [0, 12], [0.6, 1], BIGBACK) * (1 - deflate * 0.85)}`,
            rotate: `${wobble}deg`,
            translate: `${wobble * 3}px ${deflate * 120}px`,
            ...tab,
          }}
        >
          {fmtEUR(RIDE_TRAP.price, 0)}
        </div>
        {/* étincelles qui s'éteignent avec le ballon */}
        {[
          { x: 600, y: 120, s: 74, d: 0 },
          { x: 680, y: 300, s: 44, d: 6 },
          { x: -30, y: 140, s: 52, d: 3 },
          { x: 420, y: 470, s: 38, d: 9 },
        ].map((s, i) => (
          <Sparkle
            key={i}
            size={s.s}
            style={{ left: s.x, top: s.y, opacity: ip(f, [s.d + 4, s.d + 10], [0, 1]) * (1 - ip(f, [66, 76], [0, 1])), scale: 0.7 + 0.3 * Math.abs(Math.sin((f + s.d * 5) / 6)), rotate: `${f * 3}deg` }}
          />
        ))}
        {/* ce qu'elle rapporte vraiment */}
        <div style={{ position: "absolute", left: 0, top: 170, opacity: ip(f, [86, 92], [0, 1]), scale: ip(f, [86, 98], [0.5, 1], BIGBACK), transformOrigin: "left center" }}>
          <div style={{ fontSize: 210, fontWeight: 720, letterSpacing: "-0.06em", color: C.red, lineHeight: 1, ...tab }}>≈ {fmtEUR(hourly, 0)}/h</div>
          <div style={{ fontSize: 32, color: C.muted, marginTop: 14 }}>net estimé, sur 1 h 50 mobilisée</div>
        </div>
        {f >= 72 && (
          <div style={{ position: "absolute", left: 470, top: 60 }}>
            <Pop at={72} size={96} color={C.red} style={{ opacity: 1 - ip(f, [88, 96], [0, 1]) }}>
              Pschiiit.
            </Pop>
          </div>
        )}
      </div>

      {/* les épingles qui piquent le ballon */}
      <div style={{ position: "absolute", left: 1100, top: 250, display: "flex", flexDirection: "column", gap: 26 }}>
        {PINS.map((p) => (
          <div
            key={p.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              padding: "20px 30px",
              width: 640,
              borderRadius: 26,
              background: "#fff",
              border: `1.5px solid ${p.color}55`,
              boxShadow: "0 24px 50px -30px rgba(11,13,18,0.3)",
              opacity: ip(f, [p.at, p.at + 3], [0, 1], Easing.linear),
              translate: `${ip(f, [p.at, p.at + 9], [-260, 0], BACK)}px 0`,
              rotate: `${ip(f, [p.at, p.at + 9], [-10, 0])}deg`,
            }}
          >
            <span style={{ width: 62, height: 62, borderRadius: 20, display: "grid", placeItems: "center", background: `${p.color}1f`, color: p.color }}>{p.icon}</span>
            <span style={{ fontSize: 34, color: C.muted, flex: 1 }}>{p.label}</span>
            <span style={{ fontSize: 40, fontWeight: 720, color: p.color, ...tab }}>{p.value}</span>
          </div>
        ))}
      </div>

      <div style={{ position: "absolute", left: 160, bottom: 130, fontSize: 64, fontWeight: 640, letterSpacing: "-0.04em", opacity: ip(f, [108, 116], [0, 1]), translate: `0 ${ip(f, [108, 120], [30, 0])}px` }}>
        Ce qui brille ne paie pas toujours.
      </div>
      <DemoNotice opacity={enter} right />
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ 8 → 9 s : le logo, au milieu de l'écran */

function SceneLogo() {
  const f = useCurrentFrame();
  const slam = ip(f, [0, 6], [2.4, 1], BIGBACK);
  const tile = ip(f, [15, 25], [0, 1], INOUT);
  const ring = ip(f, [3, 16], [0, 1]);

  return (
    <AbsoluteFill style={{ background: C.night, alignItems: "center", justifyContent: "center" }}>
      {/* flash d'entrée */}
      <AbsoluteFill style={{ background: C.violet, opacity: ip(f, [0, 4], [0.18, 0], Easing.linear) }} />
      {/* onde de choc */}
      <div style={{ position: "absolute", left: 960 - 300, top: 470 - 300, width: 600, height: 600, borderRadius: "50%", border: `6px solid ${C.violet}`, opacity: (1 - ring) * 0.5, scale: 0.6 + ring * 1.4 }} />
      <div style={{ position: "absolute", left: 960, top: 470, translate: "-50% -50%", scale: slam * (1 - tile * 0.45) }}>
        {/* l'icône d'app se forme autour du logo */}
        <div
          style={{
            position: "absolute",
            inset: -60,
            borderRadius: 120,
            background: "#fff",
            border: `2px solid ${C.line}`,
            boxShadow: `0 50px 90px -40px rgba(11,13,18,${0.45 * tile}), 0 0 0 ${tile * 10}px ${C.violet}10`,
            opacity: tile,
            scale: 0.8 + tile * 0.2,
          }}
        />
        <div style={{ position: "relative" }}>
          <LogoMark size={440} id="film-slam" />
        </div>
      </div>
      <div style={{ position: "absolute", top: 760, textAlign: "center", opacity: ip(f, [17, 22], [0, 1]), translate: `0 ${ip(f, [17, 26], [30, 0])}px` }}>
        <div style={{ fontSize: 96, fontWeight: 680, letterSpacing: "-0.05em" }}>
          VTC Copilot <span style={{ color: C.muted, fontWeight: 420 }}>AI</span>
        </div>
        <div style={{ fontSize: 40, color: C.muted, marginTop: 6 }}>L’app des chauffeurs VTC</div>
      </div>
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ 9 → 13 s : l'IA calcule */

const PARAMS: { label: string; icon: ReactNode }[] = [
  { label: "Trafic", icon: <TrafficCone size={28} /> },
  { label: "Météo", icon: <CloudRain size={28} /> },
  { label: "Demande", icon: <TrendingUp size={28} /> },
  { label: "Offre de chauffeurs", icon: <Users size={28} /> },
  { label: "Votre voiture", icon: <Car size={28} /> },
  { label: "Approche", icon: <Navigation size={28} /> },
  { label: "Retour à vide", icon: <Undo2 size={28} /> },
  { label: "Péages", icon: <Ticket size={28} /> },
  { label: "Horaires", icon: <Clock3 size={28} /> },
  { label: "Événements", icon: <Music2 size={28} /> },
  { label: "Vos coûts", icon: <Wallet size={28} /> },
  { label: "Vos préférences", icon: <SlidersHorizontal size={28} /> },
];
const PHONE = { x: 1290, y: 540, w: 430 };
const PARAM_START = 4;
const PARAM_GAP = 4;
const PARAM_FLY = 14;

function SceneCompute() {
  const f = useCurrentFrame();
  const phoneIn = ip(f, [0, 14], [0, 1], BACK);
  const absorbed = PARAMS.filter((_, i) => f >= PARAM_START + i * PARAM_GAP + PARAM_FLY).length;
  const counter = ip(f, [8, 14], [0, 1]) * (1 - ip(f, [60, 68], [0, 1]));
  const exit = ip(f, [112, 120], [0, 1], INOUT);

  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <Backdrop tint={C.violet} tint2={C.blue} drift={f / 150} />

      <div style={{ position: "absolute", left: PHONE.x - PHONE.w / 2, top: 80, opacity: phoneIn, translate: `0 ${(1 - phoneIn) * 160}px`, scale: 1 + (f >= 16 && f < 62 ? Math.sin(f * 1.4) * 0.006 : 0) }}>
        <Phone width={PHONE.w} glow={C.violet}>
          <OverlayScreen p={ip(f, [56, 112], [0, 0.33], Easing.linear)} />
          {/* le calcul : compteur de paramètres */}
          <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.94)", display: "grid", placeItems: "center", opacity: counter }}>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 220,
                  height: 220,
                  borderRadius: "50%",
                  margin: "0 auto",
                  background: `conic-gradient(${C.violet} ${(absorbed / PARAMS.length) * 360}deg, ${C.mist} 0deg)`,
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <div style={{ width: 180, height: 180, borderRadius: "50%", background: "#fff", display: "grid", placeItems: "center", fontSize: 86, fontWeight: 720, letterSpacing: "-0.05em", ...tab }}>{absorbed}</div>
              </div>
              <div style={{ fontSize: 24, fontWeight: 600, color: C.muted, marginTop: 20 }}>paramètres analysés</div>
            </div>
          </div>
        </Phone>
      </div>

      {/* les paramètres foncent vers le téléphone */}
      {PARAMS.map((p, i) => {
        const s = PARAM_START + i * PARAM_GAP;
        const a = (i / PARAMS.length) * Math.PI * 2 - Math.PI / 2;
        const sx = Math.cos(a) * 620;
        const sy = Math.sin(a) * 420;
        const t = ip(f, [s, s + PARAM_FLY], [0, 1], Easing.in(Easing.cubic));
        return (
          <div
            key={p.label}
            style={{
              position: "absolute",
              left: PHONE.x,
              top: PHONE.y,
              translate: `calc(${sx * (1 - t)}px - 50%) calc(${sy * (1 - t)}px - 50%)`,
              opacity: ip(f, [s, s + 3], [0, 1], Easing.linear) * (1 - ip(f, [s + PARAM_FLY - 3, s + PARAM_FLY], [0, 1], Easing.linear)),
              scale: ip(f, [s, s + 5], [0.4, 1], BIGBACK) * (1 - t * 0.7),
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 24px",
              borderRadius: 99,
              background: "#fff",
              border: `1.5px solid ${C.line}`,
              fontSize: 30,
              fontWeight: 650,
              color: C.text,
              whiteSpace: "nowrap",
              boxShadow: "0 20px 40px -20px rgba(11,13,18,0.3)",
            }}
          >
            <span style={{ color: C.violet, display: "flex" }}>{p.icon}</span>
            {p.label}
          </div>
        );
      })}

      <div style={{ position: "absolute", left: 130, top: 270, display: "flex", flexDirection: "column", gap: 28 }}>
        <Pop at={8} size={118} style={{ opacity: ip(f, [8, 11], [0, 1], Easing.linear) * ip(f, [30, 40], [1, 0.35]) }}>
          Vous conduisez.
        </Pop>
        <Pop at={30} size={118} color={C.violet}>
          L’IA calcule.
        </Pop>
        <Pop at={70} size={118} color={C.green}>
          En un instant.
        </Pop>
      </div>
      <DemoNotice opacity={phoneIn} />
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ 13 → 17 s : le tri */

const SORT: { price: number; dest: string; verdict: Verdict; hourly: string; out: number }[] = [
  { price: 58, dest: "Puteaux → CDG", verdict: "green", hourly: "57 €/h", out: 1 },
  { price: 14, dest: "Paris 12e → 20e", verdict: "red", hourly: "11 €/h", out: -1 },
  { price: 27, dest: "Neuilly → Saint-Denis", verdict: "orange", hourly: "17 €/h", out: 0 },
];
const SORT_GAP = 34;

function Stamp({ verdict, hourly, at }: { verdict: Verdict; hourly: string; at: number }) {
  const f = useCurrentFrame();
  const v = VERDICT[verdict];
  return (
    <div
      style={{
        position: "absolute",
        right: -60,
        top: -96,
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 26px 14px 16px",
        borderRadius: 99,
        background: v.color,
        color: "#fff",
        fontSize: 40,
        fontWeight: 700,
        letterSpacing: "-0.02em",
        whiteSpace: "nowrap",
        boxShadow: `0 24px 40px -18px ${v.color}`,
        opacity: ip(f, [at, at + 2], [0, 1], Easing.linear),
        scale: ip(f, [at, at + 7], [2.6, 1], Easing.out(Easing.quad)),
        rotate: `${ip(f, [at, at + 7], [-20, -6])}deg`,
      }}
    >
      <span style={{ width: 50, height: 50, borderRadius: 50, display: "grid", placeItems: "center", background: "rgba(255,255,255,0.25)" }}>
        {verdict === "green" ? <Check size={30} strokeWidth={3} /> : verdict === "red" ? <X size={30} strokeWidth={3} /> : <span style={{ fontSize: 34, fontWeight: 800 }}>~</span>}
      </span>
      {v.label}
      <span style={{ fontWeight: 560, opacity: 0.85, fontSize: 32 }}>· {hourly}</span>
    </div>
  );
}

function SceneSort() {
  const f = useCurrentFrame();
  const exit = ip(f, [112, 120], [0, 1], INOUT);

  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <Backdrop tint={C.green} tint2={C.violet} drift={0.2 + f / 240} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, display: "flex", justifyContent: "center" }}>
        <Pop at={2} size={104}>
          Chaque course a sa note.
        </Pop>
      </div>

      {SORT.map((o, i) => {
        const s = 10 + i * SORT_GAP;
        const enter = ip(f, [s, s + 9], [0, 1], BACK);
        const leave = o.out === 0 ? 0 : ip(f, [s + 24, s + 34], [0, 1], Easing.in(Easing.cubic));
        const visible = f >= s && leave < 1;
        if (!visible) return null;
        return (
          <div
            key={o.price}
            style={{
              position: "absolute",
              left: 960 - 320,
              top: 430,
              opacity: enter,
              translate: `${(1 - enter) * 500 + leave * o.out * 1500}px ${leave * (o.out < 0 ? 200 : -120)}px`,
              rotate: `${leave * o.out * 18 + (1 - enter) * 8}deg`,
            }}
          >
            <OfferToast price={o.price} dest={o.dest} timer={ip(f, [s, s + 60], [1, 0.4], Easing.linear)} width={640} />
            <Stamp verdict={o.verdict} hourly={o.hourly} at={s + 12} />
            {o.out === 1 && (
              <div style={{ position: "absolute", left: 0, right: 0, bottom: -86, textAlign: "center", fontSize: 34, fontWeight: 650, color: C.green, opacity: ip(f, [s + 18, s + 22], [0, 1]) }}>
                Accepter →
              </div>
            )}
            {o.out === 0 && (
              <div style={{ position: "absolute", left: 0, right: 0, bottom: -86, textAlign: "center", fontSize: 34, fontWeight: 600, color: C.orange, opacity: ip(f, [s + 18, s + 24], [0, 1]) }}>
                À vous de voir.
              </div>
            )}
          </div>
        );
      })}

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 150, display: "flex", justifyContent: "center" }}>
        <Pop at={88} size={72} color={C.muted}>
          Vous gardez le dernier mot.
        </Pop>
      </div>
      <DemoNotice opacity={ip(f, [0, 10], [0, 1])} />
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ 17 → 20 s : signature */

function SceneBrand() {
  const f = useCurrentFrame();
  const draw = ip(f, [2, 30], [0, 1], INOUT);
  const spark = ip(f, [28, 40], [0, 1]);
  const letters = "VTC Copilot AI".split("");

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: C.night }} />
      <AbsoluteFill
        style={{
          background: `radial-gradient(50% 55% at 50% 40%, ${C.violet}22 0%, transparent 70%), radial-gradient(40% 40% at 50% 82%, ${C.green}14 0%, transparent 70%)`,
          scale: ip(f, [0, 90], [1.3, 1]),
        }}
      />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div style={{ position: "relative", scale: ip(f, [2, 30], [0.7, 1], BACK), marginTop: -40 }}>
          <LogoMark size={240} draw={draw} id="film-end" />
          {/* le € s'allume */}
          <Sparkle size={70} color={C.green} style={{ left: 170, top: 150, opacity: spark * (1 - ip(f, [44, 56], [0, 1])), scale: 0.4 + spark * 0.8, rotate: `${f * 4}deg` }} />
        </div>
        <div style={{ display: "flex", marginTop: 36, fontSize: 140, fontWeight: 680, letterSpacing: "-0.05em", color: C.text }}>
          {letters.map((l, i) => {
            const s = 14 + i * 1.4;
            return (
              <span key={i} style={{ display: "inline-block", whiteSpace: "pre", opacity: ip(f, [s, s + 8], [0, 1]), translate: `0 ${ip(f, [s, s + 14], [50, 0])}px`, fontWeight: i >= 12 ? 420 : 680, color: i >= 12 ? C.muted : C.text }}>
                {l}
              </span>
            );
          })}
        </div>
        <div style={{ fontSize: 58, fontWeight: 600, letterSpacing: "-0.03em", color: C.text, marginTop: 18, opacity: ip(f, [32, 42], [0, 1]), translate: `0 ${ip(f, [32, 46], [20, 0])}px` }}>
          Chaque course <span style={{ color: C.green }}>compte.</span>
        </div>
        <div
          style={{
            marginTop: 52,
            padding: "26px 56px",
            borderRadius: 99,
            fontSize: 44,
            fontWeight: 560,
            color: "#fff",
            background: C.ink,
            boxShadow: "0 30px 60px -20px rgba(11,13,18,0.5)",
            opacity: ip(f, [44, 54], [0, 1]),
            scale: ip(f, [44, 58], [0.8, 1], BACK),
          }}
        >
          Rejoignez la waitlist
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ montage */

const SCENES: { name: string; from: number; frames: number; Scene: () => ReactNode }[] = [
  { name: "1. La comptine", from: 0, frames: 100, Scene: SceneRhyme },
  { name: "2. Le ballon", from: 100, frames: 140, Scene: SceneBalloon },
  { name: "3. Le logo", from: 240, frames: 30, Scene: SceneLogo },
  { name: "4. L'IA calcule", from: 270, frames: 120, Scene: SceneCompute },
  { name: "5. Le tri", from: 390, frames: 120, Scene: SceneSort },
  { name: "6. Signature", from: 510, frames: 90, Scene: SceneBrand },
];

export const Film = () => (
  <AbsoluteFill style={{ background: C.night, fontFamily: FONT, color: C.text }}>
    {SCENES.map(({ name, from, frames, Scene }) => (
      <Sequence key={name} name={name} from={from} durationInFrames={frames}>
        <Scene />
      </Sequence>
    ))}
  </AbsoluteFill>
);
