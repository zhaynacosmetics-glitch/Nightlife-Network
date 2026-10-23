import { C, FONT } from "./brand";

interface MarkProps {
  size?: number;
  /** 0 → 1 : dessine l'arc puis l'aiguille (utilisé par le film et le hero). */
  draw?: number;
  id?: string;
  title?: string;
}

const ARC = "M11.98 38.02 A17 17 0 1 1 36.02 38.02";
const ARC_LEN = 80.1; // 270° d'un cercle de rayon 17

/** Symbole : une jauge de décision dont l'aiguille est une flèche de navigation, terminée par € (la rentabilité). */
export function LogoMark({ size = 40, draw = 1, id = "vca", title }: MarkProps) {
  const arc = Math.min(1, draw / 0.7);
  const needle = Math.max(0, Math.min(1, (draw - 0.45) / 0.55));
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      style={{ display: "block", flex: "none" }}
    >
      <defs>
        <linearGradient id={`${id}-g`} x1="8" y1="40" x2="40" y2="8" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={C.violet} />
          <stop offset="1" stopColor={C.blue} />
        </linearGradient>
      </defs>
      <path d={ARC} fill="none" stroke={C.line} strokeWidth={4.6} strokeLinecap="round" />
      <path
        d={ARC}
        fill="none"
        stroke={`url(#${id}-g)`}
        strokeWidth={4.6}
        strokeLinecap="round"
        strokeDasharray={ARC_LEN}
        strokeDashoffset={ARC_LEN * (1 - arc)}
      />
      <g
        style={{
          transformBox: "view-box",
          transformOrigin: "24px 26px",
          transform: `rotate(${-80 + 120 * needle}deg) scale(${0.4 + 0.6 * needle})`,
          opacity: needle > 0 ? 1 : 0,
        }}
      >
        <path d="M24 12.5 L30 30 L24 26.6 L18 30 Z" fill={C.ink} strokeLinejoin="round" />
      </g>
      {/* le bout de la jauge : €, la rentabilité */}
      <g style={{ transformBox: "fill-box", transformOrigin: "center", transform: `scale(${Math.max(0, (arc - 0.75) / 0.25)})` }}>
        <circle cx="36.02" cy="38.02" r={5.6} fill={C.green} />
        <text x="36.02" y="40.7" textAnchor="middle" fontSize="8" fontWeight="800" fontFamily="Arial, Helvetica, sans-serif" fill="#fff">
          €
        </text>
      </g>
    </svg>
  );
}

interface LogoProps {
  size?: number;
  color?: string;
  draw?: number;
  id?: string;
}

export function Logo({ size = 34, color = C.text, draw = 1, id }: LogoProps) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: size * 0.32, fontFamily: FONT }} translate="no">
      <LogoMark size={size} draw={draw} id={id} />
      <span
        style={{
          fontSize: size * 0.56,
          fontWeight: 650,
          letterSpacing: "-0.035em",
          color,
          whiteSpace: "nowrap",
          lineHeight: 1,
        }}
      >
        VTC Copilot <span style={{ fontWeight: 400, color: C.muted }}>AI</span>
      </span>
    </span>
  );
}
