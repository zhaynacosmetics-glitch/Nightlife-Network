// Film motion design « VTC Copilot AI » — 20 s, 1920×1080, 30 i/s, muet.
// Storyboard et timecodes : ../STORYBOARD.md

import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Easing, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/fonts";
import { Clock3, Gauge, MapPin, Navigation, SlidersHorizontal, Undo2, Wallet } from "lucide-react";
import { C, FONT, VERDICT, fmtEUR, fmtKm, fmtMin } from "../../shared/brand";
import { RIDE_TRAP, estimate } from "../../shared/demo";
import { LogoMark } from "../../shared/Logo";
import { Phone } from "../../shared/Phone";
import { AnalysisScreen, VerdictScreen } from "../../shared/screens";

for (const file of ["archivo-latin-wdth-normal.woff2", "archivo-latin-ext-wdth-normal.woff2"]) {
  loadFont({ family: "Archivo Variable", url: staticFile(`fonts/${file}`), weight: "100 900", display: "block" });
}

const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const INOUT = Easing.bezier(0.65, 0, 0.35, 1);
const BACK = Easing.bezier(0.34, 1.56, 0.64, 1);

/** interpolate() bornée, avec easing. */
const ip = (f: number, range: [number, number], out: [number, number], easing = OUT) =>
  interpolate(f, range, out, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

const tab: CSSProperties = { fontVariantNumeric: "tabular-nums" };
const TRAP = estimate(RIDE_TRAP);

/* ------------------------------------------------------------------ décor commun */

function Backdrop({ tint, tint2, drift = 0 }: { tint: string; tint2: string; drift?: number }) {
  return (
    <AbsoluteFill style={{ background: C.night }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(60% 70% at ${30 + drift * 12}% ${35 - drift * 8}%, ${tint}55 0%, transparent 70%), radial-gradient(55% 60% at ${78 - drift * 10}% ${70 + drift * 6}%, ${tint2}44 0%, transparent 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: "linear-gradient(rgba(160,172,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(160,172,255,0.05) 1px, transparent 1px)",
          backgroundSize: "96px 96px",
          maskImage: "radial-gradient(80% 80% at 50% 50%, black 30%, transparent 85%)",
        }}
      />
    </AbsoluteFill>
  );
}

function DemoNotice({ opacity = 1 }: { opacity?: number }) {
  return (
    <div style={{ position: "absolute", left: 80, bottom: 56, fontSize: 24, fontWeight: 500, color: C.muted, opacity, letterSpacing: "0.01em" }}>
      Exemple illustratif · données fictives
    </div>
  );
}

/** Texte révélé mot par mot, derrière un masque. */
function Kinetic({ text, start, size, color = C.text, stagger = 3, weight = 780, style }: { text: string; start: number; size: number; color?: string; stagger?: number; weight?: number; style?: CSSProperties }) {
  const f = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", columnGap: size * 0.26, fontSize: size, fontWeight: weight, fontStretch: "118%", letterSpacing: "-0.025em", lineHeight: 1.02, color, ...style }}>
      {text.split(" ").map((w, i) => {
        const s = start + i * stagger;
        return (
          <span key={i} style={{ display: "inline-block", overflow: "hidden", paddingBottom: size * 0.08 }}>
            <span style={{ display: "inline-block", translate: `0 ${ip(f, [s, s + 14], [105, 0])}%`, opacity: ip(f, [s, s + 6], [0, 1]) }}>{w}</span>
          </span>
        );
      })}
    </div>
  );
}

function OfferToast({ price, km, min, dest, timer, width = 470 }: { price: number; km: number; min: number; dest: string; timer: number; width?: number }) {
  return (
    <div
      style={{
        width,
        borderRadius: 30,
        padding: "24px 28px",
        background: `linear-gradient(180deg, ${C.panelHi}, ${C.panel})`,
        border: `1.5px solid ${C.lineStrong}`,
        boxShadow: `0 30px 80px -30px ${C.violet}cc, 0 10px 30px rgba(0,0,0,0.5)`,
        color: C.text,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 21, color: C.muted }}>
        <span style={{ background: C.blue, color: C.night, fontWeight: 700, padding: "5px 13px", borderRadius: 99, fontSize: 19 }}>Nouvelle course</span>
        Plateforme VTC
      </div>
      <div style={{ fontSize: 62, fontWeight: 780, fontStretch: "118%", marginTop: 10, letterSpacing: "-0.02em", ...tab }}>{fmtEUR(price)}</div>
      <div style={{ display: "flex", gap: 22, fontSize: 23, color: C.muted, marginTop: 4, ...tab }}>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Navigation size={22} color={C.violetSoft} /> {fmtKm(km)} · {fmtMin(min)}
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>
          <MapPin size={22} color={C.violetSoft} /> {dest}
        </span>
      </div>
      <div style={{ marginTop: 18, height: 7, borderRadius: 7, background: C.line, overflow: "hidden" }}>
        <div style={{ width: `${timer * 100}%`, height: "100%", background: timer > 0.35 ? C.blue : C.orange, borderRadius: 7 }} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ 0–4 s : le problème */

const TOASTS = [
  { at: 4, x: 120, y: 110, r: -4, price: 18.4, km: 2.8, min: 7, dest: "Paris 11e" },
  { at: 11, x: 1310, y: 150, r: 3, price: 41.0, km: 11.5, min: 24, dest: "Roissy (95)" },
  { at: 18, x: 210, y: 640, r: 2, price: 12.9, km: 1.4, min: 4, dest: "Paris 3e" },
  { at: 25, x: 1200, y: 640, r: -3, price: 27.6, km: 6.2, min: 15, dest: "Créteil (94)" },
  { at: 32, x: 700, y: 60, r: 1.5, price: 32.0, km: 16, min: 28, dest: "Seine-et-Marne" },
  { at: 40, x: 760, y: 720, r: -2, price: 23.1, km: 4.7, min: 11, dest: "Nanterre (92)" },
  { at: 47, x: 60, y: 380, r: 3.5, price: 15.2, km: 3.3, min: 9, dest: "Paris 18e" },
  { at: 54, x: 1400, y: 400, r: -2.5, price: 36.8, km: 9.1, min: 19, dest: "Versailles (78)" },
];

function SceneProblem() {
  const f = useCurrentFrame();
  const focus = ip(f, [60, 76], [0, 1]);
  const exit = ip(f, [104, 120], [0, 1], INOUT);
  const shake = f < 64 ? Math.sin(f * 1.7) * 3 * ip(f, [0, 20], [0, 1]) : 0;

  return (
    <AbsoluteFill>
      <Backdrop tint={C.blue} tint2={C.violet} drift={f / 120} />
      <AbsoluteFill style={{ translate: `${shake}px ${shake * 0.6}px`, filter: `blur(${focus * 7}px)`, opacity: 1 - focus * 0.55 }}>
        {TOASTS.map((t, i) => {
          const s = ip(f, [t.at, t.at + 12], [0.55, 1], BACK);
          const o = ip(f, [t.at, t.at + 5], [0, 1]);
          const flicker = Math.round(((f - t.at) / 5) % 3);
          const price = t.price + (f > t.at && f < t.at + 18 ? (flicker - 1) * 1.3 : 0);
          const flyX = (t.x + 235 - 960) * exit * 1.6;
          const flyY = (t.y + 110 - 540) * exit * 1.6;
          return (
            <div key={i} style={{ position: "absolute", left: t.x, top: t.y, opacity: o * (1 - exit), scale: s, rotate: `${t.r}deg`, translate: `${flyX}px ${flyY}px` }}>
              <OfferToast price={price} km={t.km} min={t.min} dest={t.dest} timer={ip(f, [t.at, t.at + 90], [1, 0.15], Easing.linear)} />
            </div>
          );
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: 1 - exit }}>
        <Kinetic text="Une course à accepter ?" start={62} size={150} style={{ justifyContent: "center", maxWidth: 1500, textAlign: "center", textShadow: "0 10px 60px rgba(0,0,0,0.6)" }} />
        <div style={{ fontSize: 44, color: C.muted, marginTop: 26, opacity: ip(f, [80, 92], [0, 1]), translate: `0 ${ip(f, [80, 92], [20, 0])}px` }}>
          Quelques secondes pour décider.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ 4–8 s : le doute */

function Factor({ icon, label, value, at, color }: { icon: ReactNode; label: string; value: string; at: number; color: string }) {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 22,
        padding: "20px 28px",
        borderRadius: 26,
        background: "rgba(16,25,63,0.85)",
        border: `1.5px solid ${color}55`,
        opacity: ip(f, [at, at + 8], [0, 1]),
        translate: `${ip(f, [at, at + 16], [-140, 0])}px 0`,
      }}
    >
      <span style={{ width: 62, height: 62, borderRadius: 20, display: "grid", placeItems: "center", background: `${color}22`, color }}>{icon}</span>
      <span style={{ fontSize: 34, color: C.muted, flex: 1 }}>{label}</span>
      <span style={{ fontSize: 40, fontWeight: 720, color, ...tab }}>{value}</span>
    </div>
  );
}

function SceneDoubt() {
  const f = useCurrentFrame();
  const enter = ip(f, [0, 18], [0, 1]);
  const truth = ip(f, [64, 80], [0, 1]);
  const exit = ip(f, [108, 120], [0, 1], INOUT);
  const hourly = ip(f, [72, 96], [32, TRAP.hourly], Easing.out(Easing.cubic));

  return (
    <AbsoluteFill style={{ opacity: 1 - exit * 0.2 }}>
      <Backdrop tint={truth > 0 ? C.red : C.violet} tint2={C.orange} drift={0.4 + f / 200} />
      <AbsoluteFill style={{ padding: "110px 120px", scale: 1 + exit * 0.06 }}>
        <div style={{ display: "flex", gap: 90, alignItems: "flex-start" }}>
          {/* la proposition */}
          <div style={{ width: 660, opacity: enter, scale: ip(f, [0, 18], [0.85, 1], BACK), translate: `0 ${ip(f, [0, 18], [40, 0])}px` }}>
            <div style={{ fontSize: 34, color: C.muted, marginBottom: 14 }}>Prix proposé</div>
            <div style={{ position: "relative", display: "inline-block" }}>
              <div style={{ fontSize: 210, fontWeight: 800, fontStretch: "120%", letterSpacing: "-0.04em", lineHeight: 0.9, color: truth > 0.5 ? C.muted : C.text, ...tab }}>
                {fmtEUR(RIDE_TRAP.price, 0)}
              </div>
              <div style={{ position: "absolute", left: -10, right: -10, top: "52%", height: 10, borderRadius: 10, background: C.red, scale: `${truth} 1`, transformOrigin: "left center" }} />
            </div>
            <div style={{ marginTop: 26, fontSize: 38, color: C.green, fontWeight: 650, opacity: ip(f, [14, 24], [0, 1]) * (1 - truth) }}>Elle a l’air intéressante…</div>
            <div style={{ marginTop: -46, fontSize: 38, color: C.text, fontWeight: 650, opacity: truth }}>Ce qu’elle rapporte vraiment :</div>
            <div style={{ marginTop: 18, display: "flex", alignItems: "baseline", gap: 18, opacity: ip(f, [70, 80], [0, 1]) }}>
              <span style={{ fontSize: 132, fontWeight: 800, fontStretch: "118%", color: C.red, letterSpacing: "-0.03em", ...tab, textShadow: `0 0 60px ${C.red}66` }}>
                ≈ {fmtEUR(hourly, 0)}/h
              </span>
            </div>
            <div style={{ fontSize: 28, color: C.muted, opacity: ip(f, [80, 90], [0, 1]) }}>net estimé, sur 1 h 50 mobilisée</div>
          </div>

          {/* ce qui change le calcul */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 18, paddingTop: 54 }}>
            <Factor at={24} color={C.orange} icon={<Navigation size={32} />} label="Approche" value={`${fmtKm(RIDE_TRAP.approachKm)} · ${fmtMin(RIDE_TRAP.approachMin)}`} />
            <Factor at={34} color={C.orange} icon={<Clock3 size={32} />} label="Course" value={`${fmtMin(RIDE_TRAP.tripMin)} · ${fmtKm(RIDE_TRAP.tripKm)}`} />
            <Factor at={44} color={C.red} icon={<Undo2 size={32} />} label="Retour à vide estimé" value={fmtMin(RIDE_TRAP.returnMin ?? 0)} />
            <Factor at={54} color={C.red} icon={<SlidersHorizontal size={32} />} label="Coûts du véhicule" value={`− ${fmtEUR(TRAP.costs)}`} />
          </div>
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 120, right: 120, bottom: 120 }}>
        <Kinetic text="Le bon prix ne suffit pas." start={86} size={112} />
      </div>
      <DemoNotice opacity={enter} />
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ 8–13 s : la solution */

const CHIPS: { label: string; icon: ReactNode; x: number; y: number }[] = [
  { label: "Prix", icon: <Wallet size={30} />, x: -620, y: -330 },
  { label: "Approche", icon: <Navigation size={30} />, x: 520, y: -380 },
  { label: "Durée", icon: <Clock3 size={30} />, x: -720, y: 60 },
  { label: "Coûts", icon: <SlidersHorizontal size={30} />, x: 600, y: 300 },
  { label: "Destination", icon: <MapPin size={30} />, x: -480, y: 380 },
  { label: "Préférences", icon: <Gauge size={30} />, x: 640, y: -40 },
];

function SceneSolution() {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sweep = ip(f, [0, 16], [0, 1], INOUT);
  const core = ip(f, [8, 30], [0, 1], BACK);
  const phoneIn = ip(f, [34, 56], [0, 1]);
  const exit = ip(f, [140, 150], [0, 1], INOUT);
  const words = ["Analysez.", "Comparez.", "Décidez."];

  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <Backdrop tint={C.violet} tint2={C.blue} drift={f / 150} />
      {/* balayage lumineux d'entrée */}
      <div
        style={{
          position: "absolute",
          top: -200,
          bottom: -200,
          width: 700,
          left: ip(f, [0, 18], [-800, 2200], INOUT),
          rotate: "14deg",
          background: `linear-gradient(90deg, transparent, ${C.violet}88, ${C.blue}aa, transparent)`,
          filter: "blur(30px)",
          opacity: 1 - ip(f, [14, 22], [0, 1]),
        }}
      />

      {/* moteur d'analyse : les facteurs convergent vers le téléphone */}
      <div style={{ position: "absolute", left: 1350, top: 540, opacity: sweep }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 520 + i * 150,
              height: 520 + i * 150,
              left: -(520 + i * 150) / 2,
              top: -(520 + i * 150) / 2,
              borderRadius: "50%",
              border: `2px ${i === 1 ? "dashed" : "solid"} rgba(160,172,255,${0.22 - i * 0.05})`,
              scale: core,
              rotate: `${(f / fps) * (i % 2 ? -18 : 24)}deg`,
            }}
          />
        ))}
        {CHIPS.map((c, i) => {
          const s = 6 + i * 4;
          const t = ip(f, [s + 8, s + 34], [0, 1], Easing.in(Easing.cubic));
          return (
            <div
              key={c.label}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                translate: `calc(${c.x * (1 - t)}px - 50%) calc(${c.y * (1 - t)}px - 50%)`,
                opacity: ip(f, [s, s + 6], [0, 1]) * (1 - ip(f, [s + 28, s + 34], [0, 1])),
                scale: 1 - t * 0.6,
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "16px 26px",
                borderRadius: 99,
                background: "rgba(16,25,63,0.92)",
                border: `1.5px solid ${C.lineStrong}`,
                fontSize: 32,
                fontWeight: 650,
                color: C.text,
                whiteSpace: "nowrap",
                boxShadow: `0 0 40px ${C.violet}55`,
              }}
            >
              <span style={{ color: C.violetSoft, display: "flex" }}>{c.icon}</span>
              {c.label}
            </div>
          );
        })}
      </div>

      <div style={{ position: "absolute", left: 1350 - 225, top: 70, opacity: phoneIn, translate: `0 ${(1 - phoneIn) * 120}px`, scale: 0.92 + phoneIn * 0.08 }}>
        <Phone width={450} glow={C.violet}>
          <AnalysisScreen p={ip(f, [44, 128], [0, 1], Easing.linear)} />
        </Phone>
      </div>

      <div style={{ position: "absolute", left: 130, top: 190 }}>
        {words.map((w, i) => {
          const s = 16 + i * 26;
          const dim = i < 2 ? ip(f, [s + 26, s + 36], [1, 0.32]) : 1;
          return (
            <div key={w} style={{ overflow: "hidden", paddingBottom: 12 }}>
              <div
                style={{
                  fontSize: 140,
                  fontWeight: 800,
                  fontStretch: "120%",
                  letterSpacing: "-0.035em",
                  lineHeight: 1,
                  color: C.text,
                  opacity: dim * ip(f, [s, s + 6], [0, 1]),
                  translate: `0 ${ip(f, [s, s + 14], [100, 0])}%`,
                }}
              >
                {w}
              </div>
            </div>
          );
        })}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 40 }}>
          {(["green", "orange", "red"] as const).map((v, i) => {
            const s = 96 + i * 8;
            return (
              <div key={v} style={{ display: "flex", alignItems: "center", gap: 18, opacity: ip(f, [s, s + 8], [0, 1]), translate: `${ip(f, [s, s + 14], [-60, 0])}px 0` }}>
                <span style={{ width: 26, height: 26, borderRadius: 26, background: VERDICT[v].color, boxShadow: `0 0 26px ${VERDICT[v].color}` }} />
                <span style={{ fontSize: 44, fontWeight: 650, color: C.text }}>{VERDICT[v].label}</span>
              </div>
            );
          })}
        </div>
      </div>
      <DemoNotice opacity={phoneIn} />
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ 13–17 s : la décision */

function SceneDecision() {
  const f = useCurrentFrame();
  const enter = ip(f, [0, 20], [0, 1]);
  const tap = ip(f, [86, 104], [0, 1]);
  const exit = ip(f, [110, 120], [0, 1], INOUT);

  return (
    <AbsoluteFill style={{ opacity: 1 - exit, scale: 1 - exit * 0.04 }}>
      <Backdrop tint={C.green} tint2={C.blue} drift={0.2 + f / 240} />
      <div style={{ position: "absolute", left: 300, top: 70, opacity: enter, translate: `${(1 - enter) * -80}px 0` }}>
        <Phone width={450} glow={C.green}>
          <VerdictScreen p={ip(f, [4, 84], [0, 1], Easing.linear)} />
          {/* toucher sur « Accepter » : le chauffeur garde la main */}
          <div
            style={{
              position: "absolute",
              right: 96,
              bottom: 64,
              width: 30,
              height: 30,
              marginRight: -15,
              marginBottom: -15,
              borderRadius: 30,
              background: "rgba(255,255,255,0.5)",
              opacity: tap > 0 ? 1 - tap : 0,
              scale: 1 + tap * 5,
            }}
          />
        </Phone>
      </div>
      <div style={{ position: "absolute", left: 880, top: 300 }}>
        <Kinetic text="Votre activité." start={14} size={112} />
        <Kinetic text="Vos coûts." start={34} size={112} />
        <Kinetic text="Vos décisions." start={54} size={112} color={C.green} />
        <div style={{ fontSize: 42, color: C.muted, marginTop: 34, opacity: ip(f, [76, 88], [0, 1]) }}>Le copilote éclaire. Vous décidez.</div>
      </div>
      <DemoNotice opacity={enter} />
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ 17–20 s : signature */

function SceneBrand() {
  const f = useCurrentFrame();
  const flash = ip(f, [0, 6], [1, 0], Easing.linear);
  const draw = ip(f, [4, 34], [0, 1], INOUT);
  const letters = "VTC COPILOT AI".split("");

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: C.night }} />
      <AbsoluteFill
        style={{
          background: `radial-gradient(50% 55% at 50% 42%, ${C.violet}66 0%, transparent 70%), radial-gradient(40% 40% at 50% 80%, ${C.blue}33 0%, transparent 70%)`,
          scale: ip(f, [0, 90], [1.3, 1]),
        }}
      />
      {/* trait de route qui traverse l'écran */}
      <div style={{ position: "absolute", top: 404, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, transparent, ${C.blue}, ${C.violet}, transparent)`, scale: `${ip(f, [0, 22], [0, 1.2])} 1`, opacity: 1 - ip(f, [18, 34], [0, 1]) }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div style={{ scale: ip(f, [4, 34], [0.7, 1], BACK), marginTop: -40 }}>
          <LogoMark size={240} draw={draw} id="film-end" />
        </div>
        <div style={{ display: "flex", marginTop: 36, fontSize: 132, fontWeight: 800, fontStretch: "125%", letterSpacing: "0.02em", color: C.text }}>
          {letters.map((l, i) => {
            const s = 16 + i * 1.4;
            return (
              <span key={i} style={{ display: "inline-block", whiteSpace: "pre", opacity: ip(f, [s, s + 8], [0, 1]), translate: `0 ${ip(f, [s, s + 14], [50, 0])}px`, fontWeight: i >= 12 ? 420 : 800 }}>
                {l}
              </span>
            );
          })}
        </div>
        <div style={{ fontSize: 54, color: C.muted, marginTop: 18, opacity: ip(f, [34, 46], [0, 1]), translate: `0 ${ip(f, [34, 48], [20, 0])}px` }}>Roulez plus intelligemment.</div>
        <div
          style={{
            marginTop: 52,
            padding: "26px 56px",
            borderRadius: 99,
            fontSize: 44,
            fontWeight: 720,
            color: "#fff",
            background: `linear-gradient(90deg, ${C.violet}, ${C.blue})`,
            boxShadow: `0 20px 70px -10px ${C.violet}`,
            opacity: ip(f, [44, 54], [0, 1]),
            scale: ip(f, [44, 58], [0.8, 1], BACK),
          }}
        >
          Rejoignez la waitlist
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#fff", opacity: flash * 0.5 }} />
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ montage */

export const Film = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: C.night, fontFamily: FONT, color: C.text }}>
      <Sequence name="Le problème" from={0} durationInFrames={4 * fps}>
        <SceneProblem />
      </Sequence>
      <Sequence name="Le doute" from={4 * fps} durationInFrames={4 * fps}>
        <SceneDoubt />
      </Sequence>
      <Sequence name="La solution" from={8 * fps} durationInFrames={5 * fps}>
        <SceneSolution />
      </Sequence>
      <Sequence name="La décision" from={13 * fps} durationInFrames={4 * fps}>
        <SceneDecision />
      </Sequence>
      <Sequence name="Signature" from={17 * fps} durationInFrames={3 * fps}>
        <SceneBrand />
      </Sequence>
    </AbsoluteFill>
  );
};

