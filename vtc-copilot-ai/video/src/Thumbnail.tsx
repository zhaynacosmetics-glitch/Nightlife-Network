// Vignette TikTok 1080×1920 : « Le VTC qui fait du BIFF », pluie de pièces €.
// Le texte reste dans le cadre central 3:4 que TikTok garde dans la grille du profil.

import type { CSSProperties } from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT } from "../../shared/brand";
import { LogoMark } from "../../shared/Logo";
import { Sparkle } from "./Film";

const glow = "0 0 60px #fff, 0 0 24px #fff, 0 0 8px #fff";

/** Générateur pseudo-aléatoire déterministe : la vignette est identique à chaque rendu. */
function rand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

// pièces réparties autour du texte, plus grosses au premier plan, floues à l'arrière-plan
const COINS = Array.from({ length: 90 }, (_, i) => {
  const depth = rand(i + 1);
  return {
    x: rand(i + 101) * 1180 - 50,
    y: rand(i + 201) * 2020 - 50,
    s: 50 + depth * 150,
    r: rand(i + 301) * 70 - 35,
    blur: depth < 0.35 ? (0.35 - depth) * 18 : 0,
    tilt: 0.55 + rand(i + 401) * 0.45,
  };
}).filter((c) => (c.blur > 0 && c.s < 90) || c.x + c.s < 150 || c.x > 930 || c.y + c.s < 560 || c.y > 1290); // dégage le texte

function Coin({ x, y, s, r, blur, tilt }: { x: number; y: number; s: number; r: number; blur: number; tilt: number }) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: s,
        height: s,
        borderRadius: s,
        background: `radial-gradient(circle at 35% 30%, #4ADE80 0%, ${C.green} 55%, #0B7A3B 100%)`,
        border: `${Math.max(3, s * 0.06)}px solid #0E8F45`,
        color: "#fff",
        display: "grid",
        placeItems: "center",
        fontSize: s * 0.58,
        fontWeight: 820,
        rotate: `${r}deg`,
        scale: `${tilt} 1`,
        filter: blur ? `blur(${blur}px)` : undefined,
        boxShadow: `0 ${s * 0.18}px ${s * 0.35}px -${s * 0.12}px rgba(14,143,69,0.55), inset 0 -${s * 0.06}px 0 rgba(0,0,0,0.12)`,
        textShadow: "0 2px 0 rgba(0,0,0,0.15)",
      }}
    >
      €
    </div>
  );
}

const line: CSSProperties = { fontWeight: 760, letterSpacing: "-0.05em", lineHeight: 1, textShadow: glow, whiteSpace: "nowrap" };

export const Thumbnail = () => (
  <AbsoluteFill style={{ background: C.night, fontFamily: FONT, color: C.text, overflow: "hidden" }}>
    <AbsoluteFill style={{ background: `radial-gradient(60% 40% at 50% 50%, ${C.green}30 0%, transparent 75%), radial-gradient(50% 30% at 50% 15%, ${C.violet}14 0%, transparent 70%)` }} />
    {COINS.filter((c) => c.blur > 0).map((c, i) => (
      <Coin key={`b${i}`} {...c} />
    ))}

    {/* rayons qui partent du BIFF */}
    <AbsoluteFill style={{ background: `repeating-conic-gradient(from 0deg at 50% 54%, ${C.green}12 0deg 8deg, transparent 8deg 20deg)`, maskImage: "radial-gradient(45% 35% at 50% 54%, black 20%, transparent 80%)" }} />

    <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ ...line, fontSize: 170 }}>Le VTC</div>
      <div style={{ ...line, fontSize: 120, marginTop: 18 }}>qui fait du</div>
      <div style={{ position: "relative", marginTop: 10, marginLeft: -30 }}>
        <div
          style={{
            fontSize: 380,
            fontWeight: 880,
            letterSpacing: "-0.06em",
            lineHeight: 0.95,
            color: C.green,
            rotate: "-6deg",
            textShadow: "0 6px 0 #0E8F45, 0 12px 0 #0B7A3B, 0 18px 0 #0B7A3B, 0 40px 60px rgba(14,143,69,0.45)",
          }}
        >
          BIFF
        </div>
        <Sparkle size={110} color={C.orange} style={{ left: -70, top: -20 }} />
        <Sparkle size={70} color={C.orange} style={{ right: -40, top: 30 }} />
        <Sparkle size={60} color={C.orange} style={{ right: 20, bottom: -10 }} />
      </div>
    </div>

    {COINS.filter((c) => !c.blur).map((c, i) => (
      <Coin key={`f${i}`} {...c} />
    ))}

    <div style={{ position: "absolute", left: 0, right: 0, top: 1500, display: "flex", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "20px 40px 20px 24px", borderRadius: 99, background: "#fff", boxShadow: "0 30px 60px -24px rgba(11,13,18,0.45)", border: `2px solid ${C.line}` }}>
        <LogoMark size={86} id="thumb-logo" />
        <span style={{ fontSize: 56, fontWeight: 700, letterSpacing: "-0.04em" }}>
          VTC Copilot <span style={{ color: C.muted, fontWeight: 420 }}>AI</span>
        </span>
      </div>
    </div>
  </AbsoluteFill>
);
