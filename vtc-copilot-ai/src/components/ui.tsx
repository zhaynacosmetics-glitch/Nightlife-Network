import type { AnchorHTMLAttributes, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion } from "motion/react";

type Variant = "primary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-[background-color,box-shadow,transform,color,border-color] duration-200 ease-out active:scale-[0.98] min-h-12 px-6 text-[15.5px]";
const variants: Record<Variant, string> = {
  primary: "bg-ink text-white shadow-[0_10px_30px_-12px_rgba(11,13,18,0.55)] hover:bg-[#23262f]",
  ghost: "border border-line bg-white text-ink hover:border-ink/25",
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
  return <div className={`mx-auto w-full max-w-[1200px] px-4 sm:px-8 ${className}`}>{children}</div>;
}

/**
 * Élément qui « jaillit » : apparition en ressort (échelle + légère rotation), puis flottement lent.
 * Sans animation si l'utilisateur a demandé de réduire les mouvements.
 */
export function Pop({
  children,
  delay = 0,
  rotate = 0,
  float = false,
  show,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  rotate?: number;
  float?: boolean;
  /** Contrôle externe ; sinon l'élément apparaît en entrant dans la vue. */
  show?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const reduced = useReducedMotion();
  const visible = show ?? inView;
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduced ? false : { opacity: 0, scale: 0.4, rotate: rotate * 2.5, y: 16 }}
      animate={visible ? { opacity: 1, scale: 1, rotate, y: 0 } : { opacity: 0, scale: 0.4, rotate: rotate * 2.5, y: 16 }}
      transition={{ type: "spring", stiffness: 380, damping: 18, mass: 0.8, delay: visible ? delay : 0 }}
    >
      <div className={float ? "animate-float" : undefined} style={float ? { animationDelay: `${-delay * 2}s` } : undefined}>
        {children}
      </div>
    </motion.div>
  );
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

/** Ouvre une fenêtre (élément <dialog>) rendue dans la page. */
export function openDialog(id: string) {
  const d = document.getElementById(id);
  if (d instanceof HTMLDialogElement && !d.open) d.showModal();
}
