import type { AnchorHTMLAttributes, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

type Variant = "primary" | "ghost" | "light";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-[background-color,box-shadow,transform,color,border-color] duration-200 ease-out active:scale-[0.98] min-h-12 px-6 text-[15.5px]";
const variants: Record<Variant, string> = {
  primary:
    "text-white bg-[linear-gradient(100deg,var(--color-violet),#5b7cff_55%,var(--color-signal))] shadow-[0_12px_40px_-12px_rgba(124,92,255,0.9)] hover:shadow-[0_16px_50px_-10px_rgba(124,92,255,1)] hover:brightness-110",
  ghost: "text-text border border-white/18 bg-white/[0.04] hover:bg-white/[0.09] hover:border-white/30",
  light: "text-ink border border-ink/15 bg-white hover:border-ink/35",
};

export function ButtonLink({ variant = "primary", className = "", children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant }) {
  return (
    <a className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </a>
  );
}

export const buttonClass = (variant: Variant = "primary", extra = "") => `${base} ${variants[variant]} ${extra}`;

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1200px] px-5 sm:px-8 ${className}`}>{children}</div>;
}

/**
 * Progression 0 → 1 jouée une fois, quand l’élément entre dans la vue.
 * Respecte prefers-reduced-motion : la valeur saute directement à 1.
 */
export function useProgress({ duration = 3.2 }: { duration?: number } = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const reduced = useReducedMotion();
  const [p, setP] = useState(0);

  useEffect(() => {
    if (!inView || reduced) return;
    const controls = animate(0, 1, { duration, ease: "linear", onUpdate: setP });
    return () => controls.stop();
  }, [inView, reduced, duration]);

  return { ref, p: reduced ? 1 : p };
}
