// Petites cartes « pop-up » qui surgissent autour du film et du smartphone.
// Toutes les valeurs affichées sont des exemples fictifs (voir shared/demo.ts).

import type { ReactNode } from "react";
import { VERDICT } from "../../shared/brand";
import type { Verdict } from "../../shared/brand";

type Tone = "violet" | "go" | "maybe" | "stop" | "ink";

const TONE: Record<Tone, string> = {
  violet: "bg-violet/10 text-violet",
  go: "bg-go/10 text-go",
  maybe: "bg-maybe/12 text-maybe",
  stop: "bg-stop/10 text-stop",
  ink: "bg-ink/6 text-ink",
};

const card = "rounded-2xl border border-line bg-white/95 shadow-[0_18px_40px_-18px_rgba(11,13,18,0.28)] backdrop-blur";

export function NotifCard({ price, route, wide = false }: { price: string; route: string; wide?: boolean }) {
  return (
    <div className={`${card} ${wide ? "w-[236px]" : "w-[200px]"} p-3.5 text-left`}>
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-violet px-2 py-0.5 text-[11px] font-semibold text-white">Nouvelle course</span>
        <span className="ml-auto size-2 animate-pulse rounded-full bg-go motion-reduce:animate-none" />
      </div>
      <div className="tabular mt-2 text-[26px] font-semibold leading-none tracking-[-0.03em]">{price}</div>
      <div className="mt-1.5 truncate text-[12.5px] text-muted">{route}</div>
      <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-mist">
        <div className="h-full w-2/3 rounded-full bg-violet/70" />
      </div>
    </div>
  );
}

export function Chip({ icon, label, value, tone = "violet" }: { icon: ReactNode; label: string; value?: string; tone?: Tone }) {
  return (
    <div className={`${card} flex items-center gap-2.5 whitespace-nowrap rounded-full py-2 pl-2 pr-4`}>
      <span className={`grid size-8 flex-none place-items-center rounded-full ${TONE[tone]}`}>{icon}</span>
      <span className="text-[13.5px] text-muted">{label}</span>
      {value && <span className="tabular text-[14px] font-semibold text-ink">{value}</span>}
    </div>
  );
}

export function VerdictPill({ verdict, value }: { verdict: Verdict; value?: string }) {
  const v = VERDICT[verdict];
  return (
    <div className={`${card} flex items-center gap-2.5 whitespace-nowrap rounded-full py-2 pl-2.5 pr-4`}>
      <span className="size-3 flex-none rounded-full" style={{ background: v.color, boxShadow: `0 0 0 4px ${v.color}22` }} />
      <span className="text-[14px] font-semibold text-ink">{v.label}</span>
      {value && <span className="tabular text-[14px] font-semibold text-ink">{value}</span>}
    </div>
  );
}
