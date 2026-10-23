// Vignette TikTok 1080×1920 : accroche du film (exemple fictif « 32 € → 6 €/h ») et promesse du produit, dans la zone sûre de TikTok.

import { AbsoluteFill } from "remotion";
import { Check, X } from "lucide-react";
import { C, FONT, VERDICT } from "../../shared/brand";
import { LogoMark } from "../../shared/Logo";
import { Sparkle } from "./Film";

const glow = "0 0 50px #fff, 0 0 20px #fff";

function Verdict({ ok, label, value, rotate }: { ok: boolean; label: string; value: string; rotate: number }) {
  const color = ok ? VERDICT.green.color : VERDICT.red.color;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 34px 18px 20px", borderRadius: 99, background: color, color: "#fff", fontSize: 50, fontWeight: 720, letterSpacing: "-0.02em", whiteSpace: "nowrap", boxShadow: `0 30px 50px -20px ${color}`, rotate: `${rotate}deg` }}>
      <span style={{ width: 62, height: 62, borderRadius: 62, display: "grid", placeItems: "center", background: "rgba(255,255,255,0.25)" }}>{ok ? <Check size={38} strokeWidth={3} /> : <X size={38} strokeWidth={3} />}</span>
      {label}
      <span style={{ fontWeight: 560, opacity: 0.85, fontSize: 40 }}>· {value}</span>
    </div>
  );
}

export const Thumbnail = () => (
  <AbsoluteFill style={{ background: C.night, fontFamily: FONT, color: C.text }}>
    <AbsoluteFill style={{ background: `radial-gradient(70% 35% at 45% 32%, ${C.red}26 0%, transparent 70%), radial-gradient(60% 30% at 45% 78%, ${C.green}22 0%, transparent 70%)` }} />
    <AbsoluteFill
      style={{
        backgroundImage: "linear-gradient(rgba(15,18,30,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(15,18,30,0.05) 1px, transparent 1px)",
        backgroundSize: "96px 96px",
        maskImage: "radial-gradient(80% 70% at 50% 50%, black 30%, transparent 85%)",
      }}
    />

    <div style={{ position: "absolute", left: 0, width: 940, top: 170, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ padding: "16px 34px", borderRadius: 99, background: C.ink, color: "#fff", fontSize: 44, fontWeight: 700, letterSpacing: "0.04em", rotate: "-2deg" }}>CHAUFFEURS VTC</div>

      <div style={{ marginTop: 60, fontSize: 92, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.05, textAlign: "center", textShadow: glow }}>
        Ta course à
      </div>
      <div style={{ position: "relative", marginTop: 6 }}>
        <div style={{ fontSize: 250, fontWeight: 760, letterSpacing: "-0.07em", lineHeight: 1, textShadow: glow }}>32 €</div>
        {/* barré d'un trait rouge */}
        <div style={{ position: "absolute", left: -20, right: -20, top: "52%", height: 26, borderRadius: 26, background: C.red, rotate: "-12deg", boxShadow: `0 10px 30px -8px ${C.red}` }} />
      </div>
      <div style={{ marginTop: 10, fontSize: 92, fontWeight: 700, letterSpacing: "-0.04em", textShadow: glow }}>te rapporte…</div>
      <div style={{ position: "relative", marginTop: 4 }}>
        <div style={{ fontSize: 330, fontWeight: 800, letterSpacing: "-0.07em", lineHeight: 0.95, color: C.red, textShadow: glow, rotate: "-3deg", whiteSpace: "nowrap" }}>6 €/h</div>
        <Sparkle size={90} color={C.orange} style={{ left: -60, top: -30 }} />
        <Sparkle size={60} color={C.orange} style={{ right: -40, top: 20 }} />
      </div>
      <div style={{ marginTop: 6, fontSize: 26, fontWeight: 500, color: C.muted }}>Exemple illustratif · chiffres fictifs</div>

      <div style={{ marginTop: 70, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <Verdict ok={false} label="Mauvaise course" value="6 €/h" rotate={2} />
        <Verdict ok label="Bonne course" value="57 €/h" rotate={-2} />
      </div>

      <div style={{ marginTop: 70, fontSize: 70, fontWeight: 720, letterSpacing: "-0.04em", lineHeight: 1.08, textAlign: "center", textShadow: glow }}>
        L’IA qui te dit
        <br />
        <span style={{ color: C.violet }}>laquelle accepter</span>
      </div>
      <div style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 18 }}>
        <LogoMark size={84} id="thumb-logo" />
        <span style={{ fontSize: 52, fontWeight: 680, letterSpacing: "-0.04em" }}>
          VTC Copilot <span style={{ color: C.muted, fontWeight: 420 }}>AI</span>
        </span>
      </div>
    </div>
  </AbsoluteFill>
);
