import Link from "next/link";
import type { ReactNode } from "react";
import { Apple, ArrowRight, BrandMark, Play } from "./icons";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2 ${className}`}
      aria-label="One Night — accueil"
    >
      <BrandMark className="h-8 w-8 transition-transform duration-300 group-hover:-rotate-6" />
      <span className="font-display text-xl tracking-tight text-white">
        One<span className="gradient-text">Night.</span>
      </span>
    </Link>
  );
}

export function Pill({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/80 backdrop-blur ${className}`}
    >
      {children}
    </span>
  );
}

type ButtonProps = {
  children: ReactNode;
  href: string;
  variant?: "primary" | "ghost" | "dark";
  className?: string;
  icon?: boolean;
};

export function Button({
  children,
  href,
  variant = "primary",
  className = "",
  icon = false,
}: ButtonProps) {
  const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary:
      "bg-neon-gradient text-white shadow-glow hover:shadow-[0_0_70px_-8px_rgba(255,46,154,0.75)]",
    ghost:
      "border border-ink/15 bg-white/60 text-ink hover:bg-white",
    dark: "bg-ink text-white hover:bg-ink-700",
  };

  return (
    <Link
      href={href}
      className={`group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 ${variants[variant]} ${className}`}
    >
      {children}
      {icon && (
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
      )}
    </Link>
  );
}

export function StoreButtons({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <Link
        href="#download"
        className="group flex items-center gap-3 rounded-2xl bg-ink px-5 py-3 text-white transition-transform duration-200 hover:-translate-y-0.5"
        aria-label="Télécharger sur l'App Store"
      >
        <Apple className="h-7 w-7" />
        <span className="text-left leading-tight">
          <span className="block text-[10px] uppercase tracking-wide text-white/60">
            Télécharger sur
          </span>
          <span className="block text-base font-semibold">App Store</span>
        </span>
      </Link>
      <Link
        href="#download"
        className="group flex items-center gap-3 rounded-2xl bg-ink px-5 py-3 text-white transition-transform duration-200 hover:-translate-y-0.5"
        aria-label="Disponible sur Google Play"
      >
        <Play className="h-6 w-6" />
        <span className="text-left leading-tight">
          <span className="block text-[10px] uppercase tracking-wide text-white/60">
            Disponible sur
          </span>
          <span className="block text-base font-semibold">Google Play</span>
        </span>
      </Link>
    </div>
  );
}
