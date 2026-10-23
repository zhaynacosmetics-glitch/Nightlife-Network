// Tokens de marque partagés entre le site (Vite) et le film (Remotion).
// Toute modification de couleur se fait ici, puis se répercute partout.

export const C = {
  // Thème clair : fond blanc, gris très légers, un seul accent (violet) et les trois couleurs de verdict.
  night: "#FFFFFF",
  abyss: "#F4F5F7",
  panel: "#FFFFFF",
  panelHi: "#FFFFFF",
  line: "rgba(15, 18, 30, 0.09)",
  lineStrong: "rgba(15, 18, 30, 0.18)",
  violet: "#6E4BFF",
  violetSoft: "#6E4BFF",
  blue: "#2E8BFF",
  green: "#0E9F5A",
  orange: "#E27A00",
  red: "#E5364B",
  mist: "#F4F5F7",
  ink: "#0B0D12",
  text: "#0B0D12",
  muted: "#5E6472",
  faint: "#878D9B",
} as const;

export const FONT = "'Geist Variable', 'Geist', system-ui, -apple-system, 'Segoe UI', sans-serif";

export type Verdict = "green" | "orange" | "red";

export const VERDICT: Record<Verdict, { color: string; label: string; short: string }> = {
  green: { color: C.green, label: "Bonne course", short: "Bonne" },
  orange: { color: C.orange, label: "Course moyenne", short: "Moyenne" },
  red: { color: C.red, label: "Mauvaise course", short: "Mauvaise" },
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
