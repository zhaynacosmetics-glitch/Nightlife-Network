// Tokens de marque partagés entre le site (Vite) et le film (Remotion).
// Toute modification de couleur se fait ici, puis se répercute partout.

export const C = {
  night: "#050918",
  abyss: "#0A1130",
  panel: "#10193F",
  panelHi: "#16224F",
  line: "rgba(160, 172, 255, 0.14)",
  lineStrong: "rgba(160, 172, 255, 0.28)",
  violet: "#7C5CFF",
  violetSoft: "#A08BFF",
  blue: "#38B6FF",
  green: "#2BD99A",
  orange: "#FFAA3B",
  red: "#FF5C70",
  mist: "#F2F4FA",
  ink: "#0A0F26",
  text: "#EAEDFF",
  muted: "#9AA3C7",
  faint: "#5E6790",
} as const;

export const FONT = "'Archivo Variable', 'Archivo', system-ui, -apple-system, 'Segoe UI', sans-serif";

export type Verdict = "green" | "orange" | "red";

export const VERDICT: Record<Verdict, { color: string; label: string; short: string }> = {
  green: { color: C.green, label: "Potentiellement rentable", short: "Rentable" },
  orange: { color: C.orange, label: "À analyser", short: "À analyser" },
  red: { color: C.red, label: "Potentiellement peu rentable", short: "Peu rentable" },
};

/* ---------- petites fonctions d'animation sans hooks (utilisables partout) ---------- */

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
/** Progression locale entre a et b (0 → 1). */
export const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOutBack = (t: number) => {
  const c1 = 1.5;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const eur2 = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", minimumFractionDigits: 2, maximumFractionDigits: 2 });
const eur0 = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", minimumFractionDigits: 0, maximumFractionDigits: 0 });
const dec1 = new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export const fmtEUR = (n: number, digits: 0 | 2 = 2) => (digits === 0 ? eur0 : eur2).format(n);
export const fmtKm = (n: number) => `${dec1.format(n)} km`;
export const fmtMin = (n: number) => `${Math.round(n)} min`;
