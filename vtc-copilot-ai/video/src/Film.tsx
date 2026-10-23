// Film motion design « VTC Copilot AI » — 27 s, 1920×1080, 30 i/s, calé sur la voix off ElevenLabs (public/audio).
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

export const OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const INOUT = Easing.bezier(0.65, 0, 0.35, 1);
export const BACK = Easing.bezier(0.34, 1.56, 0.64, 1);
export const BIGBACK = Easing.bezier(0.3, 2.1, 0.5, 1);

/** interpolate() bornée, avec easing. */
export const ip = (f: number, range: [number, number], out: [number, number], easing = OUT) =>
  interpolate(f, range, out, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

export const tab: CSSProperties = { fontVariantNumeric: "tabular-nums" };
export const TRAP = estimate(RIDE_TRAP);
const halo = "0 0 40px #fff, 0 0 18px #fff, 0 0 6px #fff";

/* ------------------------------------------------------------------ décor commun */

export function Backdrop({ tint, tint2, drift = 0 }: { tint: string; tint2: string; drift?: number }) {
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

export function DemoNotice({ opacity = 1, right = false, style }: { opacity?: number; right?: boolean; style?: CSSProperties }) {
  return (
    <div style={{ position: "absolute", [right ? "right" : "left"]: 80, bottom: 56, fontSize: 24, fontWeight: 500, color: C.muted, opacity, letterSpacing: "0.01em", ...style }}>
      Exemple illustratif · données fictives
    </div>
  );
}

/** Mot qui jaillit d'un coup (ressort), puis reste. */
export function Pop({ at, children, size = 120, color = C.text, style }: { at: number; children: ReactNode; size?: number; color?: string; style?: CSSProperties }) {
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

export function Sparkle({ size = 60, color = C.orange, style }: { size?: number; color?: string; style?: CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ position: "absolute", ...style }} aria-hidden>
      <path d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0 Z" fill={color} />
    </svg>
  );
}

export function OfferToast({ price, dest, timer, width = 420 }: { price: number; dest: string; timer: number; width?: number }) {
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

/* ------------------------------------------------------------------ minutage, calé sur la voix off (secondes → images) */

export const fr = (sec: number) => Math.round(sec * 30);
// repères relevés sur voix-off-elevenlabs.mp3 (silences et fricatives)
export const VO = {
  am: 0.05, stram: 0.55, gram: 1.1,
  vtc: 1.91, plus: 2.89,
  prix: 4.14, jackpot: 4.95,
  approche: 5.98, pschit1: 6.55, retour: 6.95, pschit2: 7.72, bouchons: 8.05, pschit3: 9.77,
  resultat: 10.54, six: 11.34,
  copilot: 12.53,
  trafic: 14.28, calcule: 16.45, seconde: 17.64,
  course: 18.7, tranche: 19.47,
  adieu: 21.26, bonjour: 22.6, biff: 23.85,
  fin: 24.6,
};

/* ------------------------------------------------------------------ « Am, stram, gram… » */

export const RAIN = [
  { at: 0, x: 110, y: 110, r: -5, price: 18, dest: "Paris 11e" },
  { at: 2, x: 1390, y: 130, r: 4, price: 41, dest: "Roissy (95)" },
  { at: 4, x: 150, y: 700, r: 3, price: 12, dest: "Paris 3e" },
  { at: 6, x: 1360, y: 690, r: -3, price: 27, dest: "Créteil (94)" },
  { at: 8, x: 760, y: 70, r: 2, price: 23, dest: "Nanterre (92)" },
  { at: 10, x: 760, y: 780, r: -2, price: 15, dest: "Paris 18e" },
];
// le doigt saute d'une proposition à l'autre, au rythme de la comptine
export const HOPS = [
  { at: fr(VO.am) + 2, toast: 0, word: "Am," },
  { at: fr(VO.stram), toast: 3, word: "stram," },
  { at: fr(VO.gram), toast: 1, word: "gram…" },
];
export const RHYME_END = fr(1.85);

function SceneRhyme() {
  const f = useCurrentFrame();
  const exit = ip(f, [RHYME_END - 6, RHYME_END], [0, 1], INOUT);
  const center = (i: number) => ({ x: RAIN[i].x + 210, y: RAIN[i].y + 95 });

  // position du doigt : saut en arc entre deux propositions
  let hx = 960;
  let hy = 1200;
  for (let k = 0; k < HOPS.length; k++) {
    const from = k === 0 ? { x: 960, y: 1200 } : center(HOPS[k - 1].toast);
    const to = center(HOPS[k].toast);
    const t = ip(f, [HOPS[k].at - 8, HOPS[k].at], [0, 1], INOUT);
    if (f >= HOPS[k].at - 8) {
      hx = from.x + (to.x - from.x) * t;
      hy = from.y + (to.y - from.y) * t - Math.sin(t * Math.PI) * 220;
    }
  }
  const lastHop = [...HOPS].reverse().find((h) => f >= h.at);
  const tapAge = lastHop ? f - lastHop.at : 99;

  return (
    <AbsoluteFill style={{ opacity: 1 - exit, scale: 1 + exit * 0.08 }}>
      <Backdrop tint={C.blue} tint2={C.violet} drift={f / 100} />
      <AbsoluteFill>
        {RAIN.map((t, i) => {
          const fall = ip(f, [t.at, t.at + 10], [-700, 0], BACK);
          const picked = HOPS.find((h) => h.toast === i && f >= h.at);
          const bump = picked ? interpolate(f, [picked.at, picked.at + 3, picked.at + 9], [1, 1.08, 1], { extrapolateRight: "clamp" }) : 1;
          return (
            <div key={i} style={{ position: "absolute", left: t.x, top: t.y, translate: `0 ${fall}px`, rotate: `${t.r + Math.sin((f + i * 9) / 9) * 1.2}deg`, scale: bump }}>
              <OfferToast price={t.price} dest={t.dest} timer={ip(f, [t.at, t.at + 60], [1, 0.2], Easing.linear)} />
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
          const next = HOPS[k + 1]?.at ?? 999;
          return f >= h.at && f < next ? (
            <div key={h.word} style={{ position: "absolute" }}>
              <Pop at={h.at} size={210} color={k === 2 ? C.violet : C.text}>
                {h.word}
              </Pop>
            </div>
          ) : null;
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ « Vous êtes VTC ? Vous voulez gagner PLUS ? » */

export const HOOK = { from: RHYME_END, to: fr(VO.prix) - 2 };
export const COIN_AT = fr(VO.plus + 0.55) - HOOK.from;
export const COINS = [
  { a: -2.7, d: 640, s: 120, at: COIN_AT },
  { a: -0.4, d: 660, s: 96, at: COIN_AT + 2 },
  { a: 0.5, d: 700, s: 80, at: COIN_AT + 4 },
  { a: 2.6, d: 660, s: 104, at: COIN_AT + 6 },
  { a: -1.9, d: 560, s: 70, at: COIN_AT + 8 },
  { a: 1.3, d: 600, s: 86, at: COIN_AT + 10 },
];

export function Coins({ list, opacity = 1, cx = 960, cy = 540, squash = 0.6 }: { list: typeof COINS; opacity?: number; cx?: number; cy?: number; squash?: number }) {
  const f = useCurrentFrame();
  return (
    <>
      {list.map((c, i) => {
        const t = ip(f, [c.at, c.at + 12], [0, 1], BACK);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: cx + Math.cos(c.a) * c.d * t - c.s / 2,
              top: cy + Math.sin(c.a) * c.d * squash * t - c.s / 2,
              width: c.s,
              height: c.s,
              borderRadius: c.s,
              background: C.green,
              color: "#fff",
              display: "grid",
              placeItems: "center",
              fontSize: c.s * 0.55,
              fontWeight: 800,
              opacity: ip(f, [c.at, c.at + 2], [0, 1], Easing.linear) * opacity,
              scale: t,
              rotate: `${Math.sin((f - c.at) / 5) * 14 * (i % 2 ? 1 : -1)}deg`,
              boxShadow: `0 20px 40px -18px ${C.green}`,
            }}
          >
            €
          </div>
        );
      })}
    </>
  );
}

function SceneHook() {
  const f = useCurrentFrame();
  const end = HOOK.to - HOOK.from;
  const exit = ip(f, [end - 5, end], [0, 1], INOUT);
  const second = fr(VO.plus) - HOOK.from;

  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <Backdrop tint={C.green} tint2={C.violet} drift={f / 120} />
      <Coins list={COINS} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 30 }}>
        <Pop at={fr(VO.vtc) - HOOK.from} size={150}>
          Vous êtes VTC ?
        </Pop>
        {f >= second && (
          <Pop at={second} size={118}>
            Vous voulez gagner <span style={{ color: C.green }}>PLUS</span> ?
          </Pop>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ « 32 euros ?! JACKPOT ?! … Pschit ! … 6 euros de l'heure. » */

export const PROB = { from: HOOK.to, to: fr(VO.copilot) - 1 };
const rel = (sec: number) => fr(sec) - PROB.from;
export const PINS = [
  { at: rel(VO.approche), icon: <Navigation size={32} />, label: "Approche", value: `${RIDE_TRAP.approachMin} min`, color: C.orange, pschit: rel(VO.pschit1), word: "Pschit !", size: 96, drop: 0.2 },
  { at: rel(VO.retour), icon: <Undo2 size={32} />, label: "Retour à vide", value: `${RIDE_TRAP.returnMin ?? 0} min`, color: C.red, pschit: rel(VO.pschit2), word: "Pschit !", size: 106, drop: 0.2 },
  { at: rel(VO.bouchons), icon: <Fuel size={32} />, label: "Bouchons, station, usure", value: `− ${fmtEUR(TRAP.costs, 0)}`, color: C.red, pschit: rel(VO.pschit3), word: "Pschiiit !", size: 140, drop: 0.45 },
];
export const RESULT_AT = rel(VO.resultat);
export const SIX_AT = rel(VO.six);
export const hm = (min: number) => `${Math.floor(min / 60)} h ${String(Math.round(min % 60)).padStart(2, "0")}`;

function SceneBalloon() {
  const f = useCurrentFrame();
  const end = PROB.to - PROB.from;
  const enter = ip(f, [0, 8], [0, 1]);
  // le ballon se dégonfle par paliers, à chaque « Pschit »
  const deflate = PINS.reduce((a, p) => a + ip(f, [p.pschit, p.pschit + 10], [0, p.drop], Easing.in(Easing.quad)), 0);
  const hiss = PINS.find((p) => f >= p.pschit && f < p.pschit + 10);
  const wobble = hiss ? Math.sin(f * 2.3) * 7 : 0;
  const hourly = ip(f, [SIX_AT, SIX_AT + 14], [RIDE_TRAP.price, TRAP.hourly], Easing.out(Easing.cubic));
  const exit = ip(f, [end - 5, end], [0, 1], INOUT);
  const jackpot = rel(VO.jackpot);

  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <Backdrop tint={deflate > 0.4 ? C.red : C.orange} tint2={C.violet} drift={0.4 + f / 300} />

      <div style={{ position: "absolute", left: 140, top: 150, width: 860, height: 620 }}>
        {/* « 32 euros ?! JACKPOT ?! » */}
        {f >= jackpot && (
          <div style={{ position: "absolute", left: 10, top: 0, opacity: 1 - ip(f, [PINS[0].at - 4, PINS[0].at + 2], [0, 1]) }}>
            <Pop at={jackpot} size={120} color={C.orange}>
              JACKPOT ?!
            </Pop>
          </div>
        )}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 150,
            fontSize: 290,
            fontWeight: 720,
            letterSpacing: "-0.07em",
            lineHeight: 1,
            whiteSpace: "nowrap",
            color: deflate > 0.5 ? C.red : C.text,
            transformOrigin: "30% 60%",
            opacity: enter * (1 - ip(f, [RESULT_AT - 4, RESULT_AT], [0, 1])),
            scale: `${ip(f, [0, 8], [0.6, 1], BIGBACK) * (1 - deflate * 0.8)} ${ip(f, [0, 8], [0.6, 1], BIGBACK) * (1 - deflate * 0.9)}`,
            rotate: `${wobble}deg`,
            translate: `${wobble * 3}px ${deflate * 160}px`,
            ...tab,
          }}
        >
          {fmtEUR(RIDE_TRAP.price, 0)} ?!
        </div>
        {[
          { x: 640, y: 170, s: 74, d: 0 },
          { x: 720, y: 360, s: 44, d: 3 },
          { x: -30, y: 180, s: 52, d: 1 },
          { x: 420, y: 510, s: 38, d: 5 },
          { x: 300, y: 120, s: 60, d: jackpot - 2 },
          { x: 780, y: 240, s: 50, d: jackpot },
        ].map((sp, i) => (
          <Sparkle
            key={i}
            size={sp.s}
            style={{ left: sp.x, top: sp.y, opacity: ip(f, [sp.d + 2, sp.d + 7], [0, 1]) * (1 - ip(f, [PINS[0].pschit - 4, PINS[0].pschit + 2], [0, 1])), scale: 0.7 + 0.3 * Math.abs(Math.sin((f + sp.d * 5) / 6)), rotate: `${f * 3}deg` }}
          />
        ))}
        {/* les trois « Pschit », le dernier plus long */}
        {PINS.map((p) =>
          f >= p.pschit && f < p.pschit + 18 ? (
            <div key={p.pschit} style={{ position: "absolute", left: 400, top: 30 }}>
              <Pop at={p.pschit} size={p.size} color={C.red}>
                {p.word}
              </Pop>
            </div>
          ) : null,
        )}
        {/* « Résultat : 6 euros de l'heure. » */}
        <div style={{ position: "absolute", left: 0, top: 110, opacity: ip(f, [RESULT_AT, RESULT_AT + 4], [0, 1]) }}>
          <div style={{ fontSize: 72, fontWeight: 650, color: C.text, letterSpacing: "-0.03em", scale: ip(f, [RESULT_AT, RESULT_AT + 10], [0.6, 1], BIGBACK), transformOrigin: "left center" }}>Résultat :</div>
          <div style={{ opacity: ip(f, [SIX_AT, SIX_AT + 3], [0, 1]), scale: ip(f, [SIX_AT, SIX_AT + 10], [0.5, 1], BIGBACK), transformOrigin: "left center" }}>
            <div style={{ fontSize: 200, fontWeight: 720, letterSpacing: "-0.06em", color: C.red, lineHeight: 1, whiteSpace: "nowrap", ...tab }}>{fmtEUR(hourly, 0)} de l’heure</div>
            <div style={{ fontSize: 30, color: C.muted, marginTop: 12 }}>net estimé, sur {hm(TRAP.totalMin)} mobilisées</div>
          </div>
        </div>
      </div>

      {/* les épingles qui piquent le ballon */}
      <div style={{ position: "absolute", left: 1100, top: 260, display: "flex", flexDirection: "column", gap: 26, opacity: 1 - ip(f, [RESULT_AT - 4, RESULT_AT + 4], [0, 1]) }}>
        {PINS.map((p) => (
          <div
            key={p.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              padding: "20px 28px",
              width: 700,
              borderRadius: 26,
              background: "#fff",
              border: `1.5px solid ${p.color}55`,
              boxShadow: "0 24px 50px -30px rgba(11,13,18,0.3)",
              opacity: ip(f, [p.at, p.at + 3], [0, 1], Easing.linear),
              translate: `${ip(f, [p.at, p.at + 8], [-260, 0], BACK)}px 0`,
              rotate: `${ip(f, [p.at, p.at + 8], [-10, 0])}deg`,
            }}
          >
            <span style={{ width: 62, height: 62, flex: "none", borderRadius: 20, display: "grid", placeItems: "center", background: `${p.color}1f`, color: p.color }}>{p.icon}</span>
            <span style={{ fontSize: 34, color: C.muted, flex: 1 }}>{p.label}</span>
            <span style={{ fontSize: 40, fontWeight: 720, color: p.color, ...tab }}>{p.value}</span>
          </div>
        ))}
      </div>
      <DemoNotice opacity={enter} right />
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ « VTC Copilot ! » : le logo au milieu de l'écran */

export const LOGO = { from: PROB.to, to: fr(VO.trafic) - 3 };

function SceneLogo() {
  const f = useCurrentFrame();
  const slam = ip(f, [0, 6], [2.4, 1], BIGBACK);
  const tile = ip(f, [20, 30], [0, 1], INOUT);
  const ring = ip(f, [3, 16], [0, 1]);
  const end = LOGO.to - LOGO.from;

  return (
    <AbsoluteFill style={{ background: C.night, alignItems: "center", justifyContent: "center", opacity: 1 - ip(f, [end - 4, end], [0, 1]) }}>
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
      <div style={{ position: "absolute", top: 760, textAlign: "center", opacity: ip(f, [8, 14], [0, 1]), translate: `0 ${ip(f, [8, 18], [30, 0])}px` }}>
        <div style={{ fontSize: 110, fontWeight: 680, letterSpacing: "-0.05em" }}>
          VTC Copilot <span style={{ color: C.muted, fontWeight: 420 }}>AI</span>
        </div>
        <div style={{ fontSize: 40, color: C.muted, marginTop: 6, opacity: ip(f, [24, 30], [0, 1]) }}>L’app des chauffeurs VTC</div>
      </div>
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ « Trafic, météo, demande, votre voiture : l'IA calcule tout. En une seconde. » */

export const COMPUTE = { from: LOGO.to, to: fr(VO.course) - 3 };
export const PARAMS: { label: string; icon: ReactNode }[] = [
  { label: "Trafic", icon: <TrafficCone size={28} /> },
  { label: "Météo", icon: <CloudRain size={28} /> },
  { label: "Demande", icon: <TrendingUp size={28} /> },
  { label: "Votre voiture", icon: <Car size={28} /> },
  { label: "Offre de chauffeurs", icon: <Users size={28} /> },
  { label: "Approche", icon: <Navigation size={28} /> },
  { label: "Retour à vide", icon: <Undo2 size={28} /> },
  { label: "Péages", icon: <Ticket size={28} /> },
  { label: "Horaires", icon: <Clock3 size={28} /> },
  { label: "Événements", icon: <Music2 size={28} /> },
  { label: "Vos coûts", icon: <Wallet size={28} /> },
  { label: "Vos préférences", icon: <SlidersHorizontal size={28} /> },
];
const PHONE = { x: 1290, y: 540, w: 430 };
export const PARAM_START = 6;
export const PARAM_GAP = 5;
export const PARAM_FLY = 14;

function SceneCompute() {
  const f = useCurrentFrame();
  const end = COMPUTE.to - COMPUTE.from;
  const calc = fr(VO.calcule) - COMPUTE.from;
  const second = fr(VO.seconde) - COMPUTE.from;
  const phoneIn = ip(f, [0, 14], [0, 1], BACK);
  const absorbed = PARAMS.filter((_, i) => f >= PARAM_START + i * PARAM_GAP + PARAM_FLY).length;
  const counter = ip(f, [8, 14], [0, 1]) * (1 - ip(f, [second - 16, second - 8], [0, 1]));
  const exit = ip(f, [end - 5, end], [0, 1], INOUT);

  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <Backdrop tint={C.violet} tint2={C.blue} drift={f / 150} />

      <div style={{ position: "absolute", left: PHONE.x - PHONE.w / 2, top: 80, opacity: phoneIn, translate: `0 ${(1 - phoneIn) * 160}px`, scale: 1 + (f >= 16 && f < second - 10 ? Math.sin(f * 1.4) * 0.006 : 0) }}>
        <Phone width={PHONE.w} glow={C.violet}>
          <OverlayScreen p={ip(f, [second - 10, end], [0, 0.33], Easing.linear)} />
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
        const st = PARAM_START + i * PARAM_GAP;
        const a = (i / PARAMS.length) * Math.PI * 2 - Math.PI / 2;
        const sx = Math.cos(a) * 620;
        const sy = Math.sin(a) * 420;
        const t = ip(f, [st, st + PARAM_FLY], [0, 1], Easing.in(Easing.cubic));
        return (
          <div
            key={p.label}
            style={{
              position: "absolute",
              left: PHONE.x,
              top: PHONE.y,
              translate: `calc(${sx * (1 - t)}px - 50%) calc(${sy * (1 - t)}px - 50%)`,
              opacity: ip(f, [st, st + 3], [0, 1], Easing.linear) * (1 - ip(f, [st + PARAM_FLY - 3, st + PARAM_FLY], [0, 1], Easing.linear)),
              scale: ip(f, [st, st + 5], [0.4, 1], BIGBACK) * (1 - t * 0.7),
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

      <div style={{ position: "absolute", left: 130, top: 270, display: "flex", flexDirection: "column", gap: 26 }}>
        <Pop at={2} size={58} color={C.muted} style={{ fontWeight: 560, letterSpacing: "-0.02em", lineHeight: 1.25 }}>
          Trafic, météo, demande,
          <br />
          votre voiture :
        </Pop>
        {f >= calc && (
          <Pop at={calc} size={118} color={C.violet}>
            l’IA calcule tout.
          </Pop>
        )}
        {f >= second && (
          <Pop at={second} size={118} color={C.green}>
            En une seconde.
          </Pop>
        )}
      </div>
      <DemoNotice opacity={phoneIn} />
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ « Une course ? VTC Copilot tranche. » */

export const SORT_SC = { from: COMPUTE.to, to: fr(VO.adieu) - 2 };

/** La pastille VTC Copilot AI, qui s'affiche juste sous la proposition. */
export function Pastille({ verdict, hourly, at }: { verdict: Verdict; hourly: string; at: number }) {
  const f = useCurrentFrame();
  const v = VERDICT[verdict];
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 22 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "14px 28px 14px 16px",
          borderRadius: 99,
          background: v.color,
          color: "#fff",
          fontSize: 40,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          whiteSpace: "nowrap",
          boxShadow: `0 24px 40px -18px ${v.color}`,
          opacity: ip(f, [at, at + 2], [0, 1], Easing.linear),
          scale: ip(f, [at, at + 8], [0.2, 1], BIGBACK),
          translate: `0 ${ip(f, [at, at + 8], [-40, 0])}px`,
        }}
      >
        <span style={{ width: 50, height: 50, borderRadius: 50, display: "grid", placeItems: "center", background: "rgba(255,255,255,0.25)" }}>
          {verdict === "green" ? <Check size={30} strokeWidth={3} /> : <X size={30} strokeWidth={3} />}
        </span>
        {v.label}
        <span style={{ fontWeight: 560, opacity: 0.85, fontSize: 32 }}>· {hourly}</span>
      </div>
    </div>
  );
}

function SceneSort() {
  const f = useCurrentFrame();
  const end = SORT_SC.to - SORT_SC.from;
  const tranche = fr(VO.tranche) - SORT_SC.from;
  const exit = ip(f, [end - 5, end], [0, 1], INOUT);
  const cards: { price: number; dest: string; verdict: Verdict; hourly: string; x: number; at: number; stamp: number }[] = [
    { price: 58, dest: "Puteaux → CDG", verdict: "green", hourly: "57 €/h", x: 960 - 640 - 40, at: 2, stamp: tranche + 8 },
    { price: 14, dest: "Paris 12e → 20e", verdict: "red", hourly: "11 €/h", x: 960 + 40, at: 8, stamp: tranche + 22 },
  ];

  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <Backdrop tint={C.green} tint2={C.violet} drift={0.2 + f / 240} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, display: "flex", justifyContent: "center", gap: 36 }}>
        <Pop at={1} size={104}>
          Une course ?
        </Pop>
        {f >= tranche && (
          <Pop at={tranche} size={104} color={C.violet}>
            VTC Copilot tranche.
          </Pop>
        )}
      </div>

      {cards.map((o) => {
        const enter = ip(f, [o.at, o.at + 8], [0, 1], BACK);
        return (
          <div key={o.price} style={{ position: "absolute", left: o.x, top: 400, opacity: enter, translate: `0 ${(1 - enter) * 200}px` }}>
            <OfferToast price={o.price} dest={o.dest} timer={ip(f, [o.at, o.at + 70], [1, 0.35], Easing.linear)} width={640} />
            <Pastille verdict={o.verdict} hourly={o.hourly} at={o.stamp} />
          </div>
        );
      })}
      <DemoNotice opacity={ip(f, [0, 10], [0, 1])} />
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ « Adieu les courses au pif… bonjour celles qui font du BIFF » */

export const BIFF_SC = { from: SORT_SC.to, to: fr(VO.fin) };
export const BIFF_AT = fr(VO.biff) - BIFF_SC.from;
export const BIFF_COINS = [
  { a: -2.8, d: 700, s: 120, at: BIFF_AT },
  { a: -0.3, d: 720, s: 96, at: BIFF_AT + 1 },
  { a: 0.35, d: 740, s: 80, at: BIFF_AT + 2 },
  { a: 2.8, d: 700, s: 104, at: BIFF_AT + 1 },
  { a: -1.6, d: 520, s: 70, at: BIFF_AT + 3 },
  { a: 1.6, d: 540, s: 86, at: BIFF_AT + 2 },
  { a: -2.2, d: 820, s: 64, at: BIFF_AT + 4 },
  { a: 0.9, d: 820, s: 72, at: BIFF_AT + 4 },
];

function SceneBiff() {
  const f = useCurrentFrame();
  const end = BIFF_SC.to - BIFF_SC.from;
  const bonjour = fr(VO.bonjour) - BIFF_SC.from;
  const exit = ip(f, [end - 5, end], [0, 1], INOUT);

  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <Backdrop tint={C.green} tint2={C.violet} drift={f / 160} />
      <Coins list={BIFF_COINS} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 26 }}>
        <Pop at={1} size={100} color={C.muted} style={{ opacity: f >= bonjour ? 0.55 : 1 }}>
          Adieu les courses au <span style={{ textDecoration: "line-through", textDecorationThickness: 8 }}>pif</span>…
        </Pop>
        {f >= bonjour && (
          <Pop at={bonjour} size={110}>
            bonjour celles qui font du{" "}
            <span style={{ display: "inline-block", color: C.green, fontWeight: 800, transformOrigin: "left 70%", scale: ip(f, [BIFF_AT, BIFF_AT + 8], [1, 1.35], BIGBACK), rotate: `${ip(f, [BIFF_AT, BIFF_AT + 8], [0, -6])}deg` }}>BIFF</span>
          </Pop>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ signature : la carte finale reste après la voix */

function SceneBrand() {
  const f = useCurrentFrame();
  const draw = ip(f, [0, 24], [0, 1], INOUT);
  const spark = ip(f, [22, 32], [0, 1]);
  const letters = "VTC Copilot AI".split("");

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: C.night }} />
      <AbsoluteFill
        style={{
          background: `radial-gradient(50% 55% at 50% 40%, ${C.violet}22 0%, transparent 70%), radial-gradient(40% 40% at 50% 82%, ${C.green}14 0%, transparent 70%)`,
          scale: ip(f, [0, 72], [1.3, 1]),
        }}
      />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div style={{ position: "relative", scale: ip(f, [0, 24], [0.7, 1], BACK), marginTop: -30 }}>
          <LogoMark size={240} draw={draw} id="film-end" />
          {/* le € s'allume */}
          <Sparkle size={70} color={C.green} style={{ left: 170, top: 150, opacity: spark * (1 - ip(f, [36, 48], [0, 1])), scale: 0.4 + spark * 0.8, rotate: `${f * 4}deg` }} />
        </div>
        <div style={{ display: "flex", marginTop: 36, fontSize: 140, fontWeight: 680, letterSpacing: "-0.05em", color: C.text }}>
          {letters.map((l, i) => {
            const st = 6 + i * 1.2;
            return (
              <span key={i} style={{ display: "inline-block", whiteSpace: "pre", opacity: ip(f, [st, st + 8], [0, 1]), translate: `0 ${ip(f, [st, st + 12], [50, 0])}px`, fontWeight: i >= 12 ? 420 : 680, color: i >= 12 ? C.muted : C.text }}>
                {l}
              </span>
            );
          })}
        </div>
        <div
          style={{
            marginTop: 54,
            padding: "26px 56px",
            borderRadius: 99,
            fontSize: 46,
            fontWeight: 560,
            color: "#fff",
            background: C.ink,
            boxShadow: "0 30px 60px -20px rgba(11,13,18,0.5)",
            opacity: ip(f, [18, 26], [0, 1]),
            scale: ip(f, [18, 30], [0.8, 1], BACK),
          }}
        >
          Rejoignez la waitlist
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ montage */

export const FILM_FRAMES = fr(27);

const SCENES: { name: string; from: number; to: number; Scene: () => ReactNode }[] = [
  { name: "1. Am, stram, gram", from: 0, to: RHYME_END, Scene: SceneRhyme },
  { name: "2. Vous êtes VTC ?", from: HOOK.from, to: HOOK.to, Scene: SceneHook },
  { name: "3. Jackpot ? Pschit !", from: PROB.from, to: PROB.to, Scene: SceneBalloon },
  { name: "4. VTC Copilot !", from: LOGO.from, to: LOGO.to, Scene: SceneLogo },
  { name: "5. L'IA calcule tout", from: COMPUTE.from, to: COMPUTE.to, Scene: SceneCompute },
  { name: "6. VTC Copilot tranche", from: SORT_SC.from, to: SORT_SC.to, Scene: SceneSort },
  { name: "7. Bonjour le biff", from: BIFF_SC.from, to: BIFF_SC.to, Scene: SceneBiff },
  { name: "8. Signature", from: BIFF_SC.to, to: FILM_FRAMES, Scene: SceneBrand },
];

export const Film = () => (
  <AbsoluteFill style={{ background: C.night, fontFamily: FONT, color: C.text }}>
    {SCENES.map(({ name, from, to, Scene }) => (
      <Sequence key={name} name={name} from={from} durationInFrames={to - from}>
        <Scene />
      </Sequence>
    ))}
  </AbsoluteFill>
);
