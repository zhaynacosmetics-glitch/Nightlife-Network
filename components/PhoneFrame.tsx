import type { ReactNode } from "react";

export function StatusBar({ time = "20:37" }: { time?: string }) {
  return (
    <div className="relative z-20 flex items-center justify-between px-7 pt-3 text-[13px] font-semibold text-white">
      <span className="tabular-nums">{time}</span>
      <div className="flex items-center gap-1.5" aria-hidden>
        {/* signal */}
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor">
          <rect x="0" y="7" width="3" height="5" rx="1" />
          <rect x="5" y="4.5" width="3" height="7.5" rx="1" />
          <rect x="10" y="2" width="3" height="10" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" opacity="0.4" />
        </svg>
        {/* wifi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
          <path d="M8 11.2 0.6 3.9a10.5 10.5 0 0 1 14.8 0L8 11.2Z" opacity="0.95" />
        </svg>
        {/* battery */}
        <svg width="26" height="13" viewBox="0 0 26 13" fill="none">
          <rect x="0.5" y="0.5" width="22" height="12" rx="3.2" stroke="currentColor" opacity="0.5" />
          <rect x="2" y="2" width="17" height="9" rx="2" fill="currentColor" />
          <rect x="24" y="4" width="2" height="5" rx="1" fill="currentColor" opacity="0.5" />
        </svg>
      </div>
    </div>
  );
}

export function PhoneFrame({
  children,
  className = "",
  glow = true,
}: {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div className={`relative ${className}`}>
      {glow && (
        <div
          aria-hidden
          className="absolute inset-0 -z-10 scale-110 rounded-[3.2rem] bg-neon-gradient opacity-30 blur-3xl"
        />
      )}
      <div className="relative rounded-[2.9rem] bg-gradient-to-b from-[#2a2330] to-[#0a0710] p-[3px] shadow-phone">
        <div className="relative overflow-hidden rounded-[2.7rem] bg-ink">
          {/* notch / dynamic island */}
          <div className="pointer-events-none absolute left-1/2 top-2.5 z-30 h-7 w-28 -translate-x-1/2 rounded-full bg-black" />
          <div className="relative h-[640px] w-[312px] overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Avatar({
  hue = 300,
  hue2 = 260,
  ring = false,
  online = false,
  className = "",
  label,
}: {
  hue?: number;
  hue2?: number;
  ring?: boolean;
  online?: boolean;
  className?: string;
  label?: string;
}) {
  return (
    <span
      className={`relative inline-block shrink-0 overflow-hidden rounded-full ${
        ring ? "ring-2 ring-neon" : ""
      } ${className}`}
      style={{
        background: `radial-gradient(120% 120% at 30% 20%, hsl(${hue} 85% 72%), hsl(${hue2} 70% 38%))`,
      }}
      role="img"
      aria-label={label ?? "Photo de profil"}
    >
      {online && (
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-ink bg-emerald-400" />
      )}
    </span>
  );
}
