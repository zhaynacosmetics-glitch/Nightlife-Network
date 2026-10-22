import type { CSSProperties, ReactNode } from "react";
import { C, FONT } from "./brand";

export const SCREEN_W = 390;
export const SCREEN_H = 844;
const BEZEL = 11;
const FRAME_W = SCREEN_W + BEZEL * 2;
const FRAME_H = SCREEN_H + BEZEL * 2;

interface PhoneProps {
  /** Largeur rendue en pixels CSS ; la hauteur suit le ratio de l'appareil. */
  width: number;
  children: ReactNode;
  style?: CSSProperties;
  glow?: string;
  label?: string;
}

/** Smartphone générique dessiné en CSS (aucune marque d'appareil). */
export function Phone({ width, children, style, glow = C.violet, label }: PhoneProps) {
  const scale = width / FRAME_W;
  return (
    <div
      role={label ? "img" : undefined}
      aria-label={label}
      style={{ width, height: FRAME_H * scale, position: "relative", flex: "none", ...style }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: FRAME_W,
          height: FRAME_H,
          transform: `scale(${scale})`,
          transformOrigin: "0 0",
          borderRadius: 64,
          background: "linear-gradient(150deg, #2B3566 0%, #121A3C 38%, #0B1129 70%, #27305C 100%)",
          boxShadow: `0 0 0 1.5px rgba(255,255,255,0.10) inset, 0 40px 90px -30px ${glow}88, 0 30px 60px -20px rgba(0,0,0,0.7)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: BEZEL,
            top: BEZEL,
            width: SCREEN_W,
            height: SCREEN_H,
            borderRadius: 53,
            overflow: "hidden",
            background: C.night,
            fontFamily: FONT,
            color: C.text,
            // isole le rendu de l'écran (perf + évite les débordements)
            contain: "layout paint",
          }}
        >
          {children}
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: 12,
              left: "50%",
              width: 112,
              height: 32,
              marginLeft: -56,
              borderRadius: 20,
              background: "#000",
              zIndex: 10,
            }}
          />
        </div>
      </div>
    </div>
  );
}
