// Version verticale 9:16 (1080×1920) du film, pour TikTok, Reels et Shorts : même voix off, même minutage, mises en page recomposées.
// Le texte et les éléments clés restent dans la zone sûre de TikTok (hors bandeau du bas et colonne de boutons à droite).

import type { ReactNode } from "react";
import { AbsoluteFill, Easing, Sequence, interpolate, useCurrentFrame } from "remotion";
import { Check, X } from "lucide-react";
import { C, FONT, VERDICT, fmtEUR, type Verdict } from "../../shared/brand";
import { RIDE_TRAP } from "../../shared/demo";
import { LogoMark } from "../../shared/Logo";
import { Phone } from "../../shared/Phone";
import { OverlayScreen } from "../../shared/coach";
import {
  BACK, BIFF_AT, BIFF_SC, BIGBACK, COINS, COMPUTE, Coins, DemoNotice, FILM_FRAMES, HOOK, HOPS, INOUT, LOGO, OfferToast, PARAMS, PARAM_FLY, PARAM_GAP,
  PARAM_START, PINS, PROB, Pop, RAIN, RESULT_AT, RHYME_END, SIX_AT, SORT_SC, Sparkle, TRAP, VO, Backdrop, fr, hm, ip, tab,
} from "./Film";

const W = 1080;
const CX = 470; // centre visuel, décalé à gauche de la colonne de boutons TikTok
const CY = 860;
const notice = { left: 60, bottom: 400 } as const;

/* ------------------------------------------------------------------ « Am, stram, gram… » : propositions en deux colonnes */

const SLOTS = [
  { x: 40, y: 230 },
  { x: 540, y: 330 },
  { x: 40, y: 1130 },
  { x: 540, y: 1230 },
  { x: 290, y: 30 },
  { x: 290, y: 1440 },
];

function VRhyme() {
  const f = useCurrentFrame();
  const exit = ip(f, [RHYME_END - 6, RHYME_END], [0, 1], INOUT);
  const center = (i: number) => ({ x: SLOTS[i].x + 210, y: SLOTS[i].y + 95 });
  let hx = CX;
  let hy = 2100;
  for (let k = 0; k < HOPS.length; k++) {
    const from = k === 0 ? { x: CX, y: 2100 } : center(HOPS[k - 1].toast);
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
      {RAIN.map((t, i) => {
        const fall = ip(f, [t.at, t.at + 10], [-900, 0], BACK);
        const picked = HOPS.find((h) => h.toast === i && f >= h.at);
        const bump = picked ? interpolate(f, [picked.at, picked.at + 3, picked.at + 9], [1, 1.08, 1], { extrapolateRight: "clamp" }) : 1;
        return (
          <div key={i} style={{ position: "absolute", left: SLOTS[i].x, top: SLOTS[i].y, translate: `0 ${fall}px`, rotate: `${t.r + Math.sin((f + i * 9) / 9) * 1.2}deg`, scale: bump }}>
            <OfferToast price={t.price} dest={t.dest} timer={ip(f, [t.at, t.at + 60], [1, 0.2], Easing.linear)} />
          </div>
        );
      })}
      <div style={{ position: "absolute", left: hx - 30, top: hy - 30, width: 60, height: 60, borderRadius: 60, background: C.violet, border: "6px solid #fff", boxShadow: "0 12px 30px -8px rgba(110,75,255,0.7)", scale: 1 - Math.max(0, 0.25 - tapAge * 0.05) }} />
      {tapAge < 12 && <div style={{ position: "absolute", left: hx - 30, top: hy - 30, width: 60, height: 60, borderRadius: 60, border: `4px solid ${C.violet}`, opacity: 1 - tapAge / 12, scale: 1 + tapAge / 3 }} />}
      <div style={{ position: "absolute", left: 0, width: CX * 2, top: CY - 100, display: "flex", justifyContent: "center" }}>
        {HOPS.map((h, k) => {
          const next = HOPS[k + 1]?.at ?? 999;
          return f >= h.at && f < next ? (
            <Pop key={h.word} at={h.at} size={200} color={k === 2 ? C.violet : C.text}>
              {h.word}
            </Pop>
          ) : null;
        })}
      </div>
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ « Vous êtes VTC ? Vous voulez gagner PLUS ? » */

function VHook() {
  const f = useCurrentFrame();
  const end = HOOK.to - HOOK.from;
  const exit = ip(f, [end - 5, end], [0, 1], INOUT);
  const second = fr(VO.plus) - HOOK.from;
  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <Backdrop tint={C.green} tint2={C.violet} drift={f / 120} />
      <Coins list={COINS} cx={CX} cy={CY} squash={1.3} />
      <div style={{ position: "absolute", left: 0, width: CX * 2, top: CY - 260, display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <Pop at={fr(VO.vtc) - HOOK.from} size={118}>
          Vous êtes VTC ?
        </Pop>
        {f >= second && (
          <>
            <Pop at={second} size={104}>
              Vous voulez
            </Pop>
            <Pop at={second + 3} size={104}>
              gagner <span style={{ color: C.green }}>PLUS</span> ?
            </Pop>
          </>
        )}
      </div>
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ « 32 euros ?! JACKPOT ?! … Pschit ! … 6 euros de l'heure. » */

function VBalloon() {
  const f = useCurrentFrame();
  const end = PROB.to - PROB.from;
  const enter = ip(f, [0, 8], [0, 1]);
  const deflate = PINS.reduce((a, p) => a + ip(f, [p.pschit, p.pschit + 10], [0, p.drop], Easing.in(Easing.quad)), 0);
  const hiss = PINS.find((p) => f >= p.pschit && f < p.pschit + 10);
  const wobble = hiss ? Math.sin(f * 2.3) * 7 : 0;
  const hourly = ip(f, [SIX_AT, SIX_AT + 14], [RIDE_TRAP.price, TRAP.hourly], Easing.out(Easing.cubic));
  const exit = ip(f, [end - 5, end], [0, 1], INOUT);
  const jackpot = fr(VO.jackpot) - PROB.from;
  const gone = ip(f, [RESULT_AT - 4, RESULT_AT + 4], [0, 1]);

  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <Backdrop tint={deflate > 0.4 ? C.red : C.orange} tint2={C.violet} drift={0.4 + f / 300} />

      {/* le ballon « 32 € ?! » et ses éclats */}
      <div style={{ position: "absolute", left: 60, top: 200, width: 880, height: 640 }}>
        {f >= jackpot && (
          <div style={{ position: "absolute", left: 0, top: 0, opacity: 1 - ip(f, [PINS[0].at - 4, PINS[0].at + 2], [0, 1]) }}>
            <Pop at={jackpot} size={124} color={C.orange}>
              JACKPOT ?!
            </Pop>
          </div>
        )}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 170,
            fontSize: 250,
            fontWeight: 720,
            letterSpacing: "-0.07em",
            lineHeight: 1,
            whiteSpace: "nowrap",
            color: deflate > 0.5 ? C.red : C.text,
            transformOrigin: "30% 60%",
            opacity: enter * (1 - ip(f, [RESULT_AT - 4, RESULT_AT], [0, 1])),
            scale: `${ip(f, [0, 8], [0.6, 1], BIGBACK) * (1 - deflate * 0.8)} ${ip(f, [0, 8], [0.6, 1], BIGBACK) * (1 - deflate * 0.9)}`,
            rotate: `${wobble}deg`,
            translate: `${wobble * 3}px ${deflate * 140}px`,
            ...tab,
          }}
        >
          {fmtEUR(RIDE_TRAP.price, 0)} ?!
        </div>
        {[
          { x: 640, y: 150, s: 74, d: 0 },
          { x: 760, y: 380, s: 44, d: 3 },
          { x: -20, y: 170, s: 52, d: 1 },
          { x: 420, y: 470, s: 38, d: 5 },
          { x: 520, y: 40, s: 60, d: jackpot - 2 },
          { x: 820, y: 230, s: 50, d: jackpot },
        ].map((sp, i) => (
          <Sparkle
            key={i}
            size={sp.s}
            style={{ left: sp.x, top: sp.y, opacity: ip(f, [sp.d + 2, sp.d + 7], [0, 1]) * (1 - ip(f, [PINS[0].pschit - 4, PINS[0].pschit + 2], [0, 1])), scale: 0.7 + 0.3 * Math.abs(Math.sin((f + sp.d * 5) / 6)), rotate: `${f * 3}deg` }}
          />
        ))}
        {PINS.map((p) =>
          f >= p.pschit && f < p.pschit + 18 ? (
            <div key={p.pschit} style={{ position: "absolute", left: 200, top: 10 }}>
              <Pop at={p.pschit} size={p.size * 1.1} color={C.red}>
                {p.word}
              </Pop>
            </div>
          ) : null,
        )}
      </div>

      {/* « Résultat : 6 euros de l'heure. » */}
      <div style={{ position: "absolute", left: 60, top: 520, opacity: ip(f, [RESULT_AT, RESULT_AT + 4], [0, 1]) }}>
        <div style={{ fontSize: 84, fontWeight: 650, color: C.text, letterSpacing: "-0.03em", scale: ip(f, [RESULT_AT, RESULT_AT + 10], [0.6, 1], BIGBACK), transformOrigin: "left center" }}>Résultat :</div>
        <div style={{ opacity: ip(f, [SIX_AT, SIX_AT + 3], [0, 1]), scale: ip(f, [SIX_AT, SIX_AT + 10], [0.5, 1], BIGBACK), transformOrigin: "left center" }}>
          <div style={{ fontSize: 330, fontWeight: 740, letterSpacing: "-0.07em", color: C.red, lineHeight: 0.95, whiteSpace: "nowrap", ...tab }}>{fmtEUR(hourly, 0)}</div>
          <div style={{ fontSize: 140, fontWeight: 720, letterSpacing: "-0.05em", color: C.red, lineHeight: 1, whiteSpace: "nowrap" }}>de l’heure</div>
          <div style={{ fontSize: 34, color: C.muted, marginTop: 18 }}>net estimé, sur {hm(TRAP.totalMin)} mobilisées</div>
        </div>
      </div>

      {/* les épingles qui piquent le ballon */}
      <div style={{ position: "absolute", left: 60, top: 920, display: "flex", flexDirection: "column", gap: 24, opacity: 1 - gone }}>
        {PINS.map((p) => (
          <div
            key={p.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              padding: "22px 28px",
              width: 860,
              borderRadius: 28,
              background: "#fff",
              border: `1.5px solid ${p.color}55`,
              boxShadow: "0 24px 50px -30px rgba(11,13,18,0.3)",
              opacity: ip(f, [p.at, p.at + 3], [0, 1], Easing.linear),
              translate: `${ip(f, [p.at, p.at + 8], [-260, 0], BACK)}px 0`,
              rotate: `${ip(f, [p.at, p.at + 8], [-10, 0])}deg`,
            }}
          >
            <span style={{ width: 66, height: 66, flex: "none", borderRadius: 20, display: "grid", placeItems: "center", background: `${p.color}1f`, color: p.color }}>{p.icon}</span>
            <span style={{ fontSize: 36, color: C.muted, flex: 1 }}>{p.label}</span>
            <span style={{ fontSize: 44, fontWeight: 720, color: p.color, ...tab }}>{p.value}</span>
          </div>
        ))}
      </div>
      <DemoNotice opacity={enter} style={notice} />
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ « VTC Copilot ! » */

function VLogo() {
  const f = useCurrentFrame();
  const slam = ip(f, [0, 6], [2.4, 1], BIGBACK);
  const tile = ip(f, [20, 30], [0, 1], INOUT);
  const ring = ip(f, [3, 16], [0, 1]);
  const end = LOGO.to - LOGO.from;
  const y = CY - 140;
  return (
    <AbsoluteFill style={{ background: C.night, opacity: 1 - ip(f, [end - 4, end], [0, 1]) }}>
      <AbsoluteFill style={{ background: C.violet, opacity: ip(f, [0, 4], [0.18, 0], Easing.linear) }} />
      <div style={{ position: "absolute", left: CX - 320, top: y - 320, width: 640, height: 640, borderRadius: "50%", border: `6px solid ${C.violet}`, opacity: (1 - ring) * 0.5, scale: 0.6 + ring * 1.4 }} />
      <div style={{ position: "absolute", left: CX, top: y, translate: "-50% -50%", scale: slam * (1 - tile * 0.45) }}>
        <div style={{ position: "absolute", inset: -60, borderRadius: 120, background: "#fff", border: `2px solid ${C.line}`, boxShadow: `0 50px 90px -40px rgba(11,13,18,${0.45 * tile}), 0 0 0 ${tile * 10}px ${C.violet}10`, opacity: tile, scale: 0.8 + tile * 0.2 }} />
        <div style={{ position: "relative" }}>
          <LogoMark size={480} id="vfilm-slam" />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, width: CX * 2, top: y + 300, textAlign: "center", opacity: ip(f, [8, 14], [0, 1]), translate: `0 ${ip(f, [8, 18], [30, 0])}px` }}>
        <div style={{ fontSize: 112, fontWeight: 680, letterSpacing: "-0.05em", whiteSpace: "nowrap" }}>
          VTC Copilot <span style={{ color: C.muted, fontWeight: 420 }}>AI</span>
        </div>
        <div style={{ fontSize: 44, color: C.muted, marginTop: 10, opacity: ip(f, [24, 30], [0, 1]) }}>L’app des chauffeurs VTC</div>
      </div>
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ « Trafic, météo, demande, votre voiture : l'IA calcule tout. En une seconde. » */

const VPHONE = { w: 340, top: 150 };

function VCompute() {
  const f = useCurrentFrame();
  const end = COMPUTE.to - COMPUTE.from;
  const calc = fr(VO.calcule) - COMPUTE.from;
  const second = fr(VO.seconde) - COMPUTE.from;
  const phoneIn = ip(f, [0, 14], [0, 1], BACK);
  const absorbed = PARAMS.filter((_, i) => f >= PARAM_START + i * PARAM_GAP + PARAM_FLY).length;
  const counter = ip(f, [8, 14], [0, 1]) * (1 - ip(f, [second - 16, second - 8], [0, 1]));
  const exit = ip(f, [end - 5, end], [0, 1], INOUT);
  const phoneCY = VPHONE.top + 360;

  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <Backdrop tint={C.violet} tint2={C.blue} drift={f / 150} />
      <div style={{ position: "absolute", left: CX - VPHONE.w / 2, top: VPHONE.top, opacity: phoneIn, translate: `0 ${(1 - phoneIn) * 160}px`, scale: 1 + (f >= 16 && f < second - 10 ? Math.sin(f * 1.4) * 0.006 : 0) }}>
        <Phone width={VPHONE.w} glow={C.violet}>
          <OverlayScreen p={ip(f, [second - 10, end], [0, 0.33], Easing.linear)} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.94)", display: "grid", placeItems: "center", opacity: counter }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 220, height: 220, borderRadius: "50%", margin: "0 auto", background: `conic-gradient(${C.violet} ${(absorbed / PARAMS.length) * 360}deg, ${C.mist} 0deg)`, display: "grid", placeItems: "center" }}>
                <div style={{ width: 180, height: 180, borderRadius: "50%", background: "#fff", display: "grid", placeItems: "center", fontSize: 86, fontWeight: 720, letterSpacing: "-0.05em", ...tab }}>{absorbed}</div>
              </div>
              <div style={{ fontSize: 24, fontWeight: 600, color: C.muted, marginTop: 20 }}>paramètres analysés</div>
            </div>
          </div>
        </Phone>
      </div>

      {PARAMS.map((p, i) => {
        const st = PARAM_START + i * PARAM_GAP;
        const a = (i / PARAMS.length) * Math.PI * 2 - Math.PI / 2;
        const sx = Math.cos(a) * 330;
        const sy = Math.sin(a) * 480;
        const t = ip(f, [st, st + PARAM_FLY], [0, 1], Easing.in(Easing.cubic));
        return (
          <div
            key={p.label}
            style={{
              position: "absolute",
              left: CX,
              top: phoneCY,
              translate: `calc(${sx * (1 - t)}px - 50%) calc(${sy * (1 - t)}px - 50%)`,
              opacity: ip(f, [st, st + 3], [0, 1], Easing.linear) * (1 - ip(f, [st + PARAM_FLY - 3, st + PARAM_FLY], [0, 1], Easing.linear)),
              scale: ip(f, [st, st + 5], [0.4, 1], BIGBACK) * (1 - t * 0.7),
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "16px 26px",
              borderRadius: 99,
              background: "#fff",
              border: `1.5px solid ${C.line}`,
              fontSize: 34,
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

      <div style={{ position: "absolute", left: 60, top: 1000, display: "flex", flexDirection: "column", gap: 22 }}>
        <Pop at={2} size={58} color={C.muted} style={{ fontWeight: 560, letterSpacing: "-0.02em", lineHeight: 1.2, transformOrigin: "left center" }}>
          Trafic, météo, demande,
          <br />
          votre voiture :
        </Pop>
        {f >= calc && (
          <Pop at={calc} size={104} color={C.violet} style={{ transformOrigin: "left center" }}>
            l’IA calcule tout.
          </Pop>
        )}
        {f >= second && (
          <Pop at={second} size={104} color={C.green} style={{ transformOrigin: "left center" }}>
            En une seconde.
          </Pop>
        )}
      </div>
      <DemoNotice opacity={phoneIn} style={notice} />
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ « Une course ? VTC Copilot tranche. » */

function VPastille({ verdict, hourly, at }: { verdict: Verdict; hourly: string; at: number }) {
  const f = useCurrentFrame();
  const v = VERDICT[verdict];
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 22 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "16px 30px 16px 18px",
          borderRadius: 99,
          background: v.color,
          color: "#fff",
          fontSize: 46,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          whiteSpace: "nowrap",
          boxShadow: `0 24px 40px -18px ${v.color}`,
          opacity: ip(f, [at, at + 2], [0, 1], Easing.linear),
          scale: ip(f, [at, at + 8], [0.2, 1], BIGBACK),
          translate: `0 ${ip(f, [at, at + 8], [-40, 0])}px`,
        }}
      >
        <span style={{ width: 56, height: 56, borderRadius: 56, display: "grid", placeItems: "center", background: "rgba(255,255,255,0.25)" }}>
          {verdict === "green" ? <Check size={34} strokeWidth={3} /> : <X size={34} strokeWidth={3} />}
        </span>
        {v.label}
        <span style={{ fontWeight: 560, opacity: 0.85, fontSize: 36 }}>· {hourly}</span>
      </div>
    </div>
  );
}

function VSort() {
  const f = useCurrentFrame();
  const end = SORT_SC.to - SORT_SC.from;
  const tranche = fr(VO.tranche) - SORT_SC.from;
  const exit = ip(f, [end - 5, end], [0, 1], INOUT);
  const cards: { price: number; dest: string; verdict: Verdict; hourly: string; top: number; at: number; stamp: number }[] = [
    { price: 58, dest: "Puteaux → CDG", verdict: "green", hourly: "57 €/h", top: 560, at: 2, stamp: tranche + 8 },
    { price: 14, dest: "Paris 12e → 20e", verdict: "red", hourly: "11 €/h", top: 1010, at: 8, stamp: tranche + 22 },
  ];
  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <Backdrop tint={C.green} tint2={C.violet} drift={0.2 + f / 240} />
      <div style={{ position: "absolute", left: 0, width: CX * 2, top: 190, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        <Pop at={1} size={110}>
          Une course ?
        </Pop>
        {f >= tranche && (
          <Pop at={tranche} size={92} color={C.violet}>
            VTC Copilot tranche.
          </Pop>
        )}
      </div>
      {cards.map((o) => {
        const enter = ip(f, [o.at, o.at + 8], [0, 1], BACK);
        return (
          <div key={o.price} style={{ position: "absolute", left: CX - 400, top: o.top, opacity: enter, translate: `0 ${(1 - enter) * 200}px` }}>
            <OfferToast price={o.price} dest={o.dest} timer={ip(f, [o.at, o.at + 70], [1, 0.35], Easing.linear)} width={800} />
            <VPastille verdict={o.verdict} hourly={o.hourly} at={o.stamp} />
          </div>
        );
      })}
      <DemoNotice opacity={ip(f, [0, 10], [0, 1])} style={notice} />
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ « Adieu les courses au pif… bonjour celles qui font du BIFF » */

const VBIFF_COINS = [
  { a: -2.8, d: 420, s: 120, at: BIFF_AT },
  { a: -0.3, d: 430, s: 96, at: BIFF_AT + 1 },
  { a: 0.35, d: 440, s: 80, at: BIFF_AT + 2 },
  { a: 2.8, d: 420, s: 104, at: BIFF_AT + 1 },
  { a: -1.6, d: 380, s: 70, at: BIFF_AT + 3 },
  { a: 1.6, d: 400, s: 86, at: BIFF_AT + 2 },
  { a: -2.2, d: 470, s: 64, at: BIFF_AT + 4 },
  { a: 0.9, d: 470, s: 72, at: BIFF_AT + 4 },
];

function VBiff() {
  const f = useCurrentFrame();
  const end = BIFF_SC.to - BIFF_SC.from;
  const bonjour = fr(VO.bonjour) - BIFF_SC.from;
  const exit = ip(f, [end - 5, end], [0, 1], INOUT);
  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <Backdrop tint={C.green} tint2={C.violet} drift={f / 160} />
      <Coins list={VBIFF_COINS} cx={CX} cy={CY} squash={1.6} />
      <div style={{ position: "absolute", left: 0, width: CX * 2, top: CY - 330, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <div style={{ opacity: f >= bonjour ? 0.55 : 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <Pop at={1} size={96} color={C.muted}>
            Adieu les courses
          </Pop>
          <Pop at={3} size={96} color={C.muted}>
            au <span style={{ textDecoration: "line-through", textDecorationThickness: 8 }}>pif</span>…
          </Pop>
        </div>
        {f >= bonjour && (
          <>
            <Pop at={bonjour} size={100} style={{ marginTop: 30 }}>
              bonjour celles
            </Pop>
            <Pop at={bonjour + 3} size={100}>
              qui font du
            </Pop>
            <div style={{ fontSize: 230, fontWeight: 820, letterSpacing: "-0.06em", lineHeight: 1, color: C.green, textShadow: "0 0 40px #fff", opacity: ip(f, [BIFF_AT - 4, BIFF_AT], [0, 1], Easing.linear), scale: ip(f, [BIFF_AT - 4, BIFF_AT + 8], [0.3, 1], BIGBACK), rotate: `${ip(f, [BIFF_AT, BIFF_AT + 8], [0, -6])}deg` }}>
              BIFF
            </div>
          </>
        )}
      </div>
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ signature */

function VBrand() {
  const f = useCurrentFrame();
  const draw = ip(f, [0, 24], [0, 1], INOUT);
  const spark = ip(f, [22, 32], [0, 1]);
  const letters = "VTC Copilot AI".split("");
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: C.night }} />
      <AbsoluteFill style={{ background: `radial-gradient(60% 40% at 45% 38%, ${C.violet}22 0%, transparent 70%), radial-gradient(50% 30% at 45% 70%, ${C.green}14 0%, transparent 70%)`, scale: ip(f, [0, 72], [1.3, 1]) }} />
      <div style={{ position: "absolute", left: 0, width: CX * 2, top: 470, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ position: "relative", scale: ip(f, [0, 24], [0.7, 1], BACK) }}>
          <LogoMark size={300} draw={draw} id="vfilm-end" />
          <Sparkle size={80} color={C.green} style={{ left: 212, top: 186, opacity: spark * (1 - ip(f, [36, 48], [0, 1])), scale: 0.4 + spark * 0.8, rotate: `${f * 4}deg` }} />
        </div>
        <div style={{ display: "flex", marginTop: 44, fontSize: 116, fontWeight: 680, letterSpacing: "-0.05em", color: C.text }}>
          {letters.map((l, i) => {
            const st = 6 + i * 1.2;
            return (
              <span key={i} style={{ display: "inline-block", whiteSpace: "pre", opacity: ip(f, [st, st + 8], [0, 1]), translate: `0 ${ip(f, [st, st + 12], [50, 0])}px`, fontWeight: i >= 12 ? 420 : 680, color: i >= 12 ? C.muted : C.text }}>
                {l}
              </span>
            );
          })}
        </div>
        <div style={{ marginTop: 60, padding: "30px 60px", borderRadius: 99, fontSize: 52, fontWeight: 600, color: "#fff", background: C.ink, boxShadow: "0 30px 60px -20px rgba(11,13,18,0.5)", opacity: ip(f, [18, 26], [0, 1]), scale: ip(f, [18, 30], [0.8, 1], BACK) }}>
          Rejoignez la waitlist
        </div>
        <div style={{ marginTop: 30, fontSize: 38, fontWeight: 500, color: C.muted, opacity: ip(f, [28, 36], [0, 1]) }}>Lien en bio</div>
      </div>
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ montage (mêmes repères que la version 16:9) */

const SCENES: { name: string; from: number; to: number; Scene: () => ReactNode }[] = [
  { name: "1. Am, stram, gram", from: 0, to: RHYME_END, Scene: VRhyme },
  { name: "2. Vous êtes VTC ?", from: HOOK.from, to: HOOK.to, Scene: VHook },
  { name: "3. Jackpot ? Pschit !", from: PROB.from, to: PROB.to, Scene: VBalloon },
  { name: "4. VTC Copilot !", from: LOGO.from, to: LOGO.to, Scene: VLogo },
  { name: "5. L'IA calcule tout", from: COMPUTE.from, to: COMPUTE.to, Scene: VCompute },
  { name: "6. VTC Copilot tranche", from: SORT_SC.from, to: SORT_SC.to, Scene: VSort },
  { name: "7. Bonjour le biff", from: BIFF_SC.from, to: BIFF_SC.to, Scene: VBiff },
  { name: "8. Signature", from: BIFF_SC.to, to: FILM_FRAMES, Scene: VBrand },
];

export const FilmVertical = () => (
  <AbsoluteFill style={{ background: C.night, fontFamily: FONT, color: C.text, width: W }}>
    {SCENES.map(({ name, from, to, Scene }) => (
      <Sequence key={name} name={name} from={from} durationInFrames={to - from}>
        <Scene />
      </Sequence>
    ))}
  </AbsoluteFill>
);
