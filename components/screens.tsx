import { StatusBar, Avatar } from "./PhoneFrame";
import { BrandMark } from "./icons";
import {
  Heart,
  Chat,
  Send,
  Martini,
  Ticket,
  Users,
  Eye,
  MapPin,
  Check,
  QrCode,
} from "./icons";

/* A reusable "party photo" backdrop made of layered gradients (no external assets). */
function CrowdBackdrop({ from = 320, to = 265 }: { from?: number; to?: number }) {
  return (
    <div
      className="absolute inset-0"
      aria-hidden
      style={{
        background: `
          radial-gradient(60% 40% at 30% 18%, hsl(${from} 90% 60% / .55), transparent 70%),
          radial-gradient(50% 45% at 80% 30%, hsl(${to} 85% 55% / .5), transparent 70%),
          radial-gradient(80% 60% at 50% 110%, #0b0710 30%, transparent),
          linear-gradient(180deg, #1a1020 0%, #0b0710 100%)`,
      }}
    >
      {/* crowd silhouette */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 grain opacity-[0.18]" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-center gap-1 px-3 opacity-60">
        {[34, 52, 40, 64, 46, 58, 38, 60, 44].map((h, i) => (
          <div
            key={i}
            className="w-6 rounded-t-full bg-black/70"
            style={{ height: h }}
          />
        ))}
      </div>
    </div>
  );
}

function BottomNav({ active = 1 }: { active?: number }) {
  const items = [Ticket, Martini, Heart, Chat, Users];
  return (
    <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-around border-t border-white/10 bg-ink/90 px-2 py-3 backdrop-blur">
      {items.map((Icon, i) => (
        <Icon
          key={i}
          className={`h-6 w-6 ${i === active ? "text-white" : "text-white/35"}`}
        />
      ))}
    </div>
  );
}

/* ───────────────────────── Live feed (hero) ───────────────────────── */
export function LiveFeedScreen() {
  return (
    <div className="absolute inset-0 bg-ink text-white">
      <CrowdBackdrop from={325} to={255} />
      <StatusBar time="0:37" />

      {/* tabs */}
      <div className="relative z-20 mt-2 flex items-center gap-4 px-5 text-[13px] font-semibold">
        <span className="relative pb-1 text-white">
          ALL
          <span className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-neon" />
        </span>
        <span className="pb-1 text-white/45">LIVE</span>
        <span className="pb-1 text-white/45">TONIGHT</span>
        <span className="ml-auto pb-1 text-white/45">ME</span>
      </div>

      {/* live badge */}
      <div className="relative z-20 mt-4 flex items-center gap-2 px-5">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-neon px-2 py-1 text-[11px] font-bold">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
          LIVE
        </span>
        <span className="flex items-center gap-1 text-[11px] text-white/80">
          <Eye className="h-3.5 w-3.5" /> 352 regardent
        </span>
      </div>

      {/* action rail */}
      <div className="absolute right-3 top-1/2 z-20 flex -translate-y-1/2 flex-col items-center gap-4">
        <div className="relative">
          <span className="absolute inset-0 animate-pulse-ring rounded-full border-2 border-neon" />
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink/70 ring-2 ring-neon">
            <Martini className="h-6 w-6 text-neon" />
          </span>
        </div>
        <RailAction icon={<Heart className="h-6 w-6" />} value="126" />
        <RailAction icon={<Chat className="h-6 w-6" />} value="34" />
        <RailAction icon={<Send className="h-6 w-6" />} value="21" />
      </div>

      {/* bottom card */}
      <div className="absolute inset-x-0 bottom-16 z-20 px-5">
        <div className="flex items-center gap-2">
          <Avatar hue={330} className="h-9 w-9 ring-2 ring-white/70" label="Ana Maria" />
          <div className="leading-tight">
            <p className="flex items-center gap-1 text-sm font-bold">
              Ana Maria
              <Check className="h-3.5 w-3.5 rounded-full bg-violet p-[1px] text-white" />
            </p>
            <p className="text-xs text-white/70">One night ! 🔥</p>
          </div>
        </div>
        <button className="mt-3 inline-flex items-center gap-2 rounded-full border border-neon/70 bg-neon/15 px-4 py-2 text-xs font-bold text-neon">
          <Martini className="h-4 w-4" /> Réserver en 1 clic
        </button>
      </div>

      <BottomNav active={1} />
    </div>
  );
}

function RailAction({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 text-white">
      {icon}
      <span className="text-[11px] font-semibold">{value}</span>
    </div>
  );
}

/* ───────────────────────── Chat ───────────────────────── */
export function ChatScreen() {
  return (
    <div className="absolute inset-0 bg-ink text-white">
      <StatusBar time="9:41" />
      {/* header */}
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-3">
        <Avatar hue={330} hue2={280} online className="h-10 w-10" label="Léa" />
        <div className="leading-tight">
          <p className="text-base font-bold">Léa</p>
          <p className="text-xs font-medium text-neon">White &amp; Pen Lausanne</p>
        </div>
        <span className="ml-auto text-white/40">•••</span>
      </div>

      <div className="space-y-3 px-4 py-4 text-[13px]">
        <p className="text-center text-[11px] text-white/40">Aujourd&apos;hui</p>
        <Bubble side="left">Pourquoi t&apos;as autant hésité à venir me parler ?</Bubble>
        <Bubble side="right">Honnêtement ? T&apos;avais l&apos;air inaccessible ! 😅</Bubble>
        <Bubble side="left">Inaccessible ? Pas du tout j&apos;étais juste avec mes amis 🤭</Bubble>
        <Bubble side="right">Ouais mais tu souriais trop… j&apos;ai cru que t&apos;étais hors-ligue 😅</Bubble>
      </div>

      {/* input */}
      <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 border-t border-white/10 bg-ink/95 px-4 py-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet text-white">+</span>
        <div className="flex-1 rounded-full bg-white/10 px-4 py-2 text-xs text-white/40">
          Écrire un message…
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neon-gradient text-white">
          <Send className="h-4 w-4" />
        </span>
      </div>
    </div>
  );
}

function Bubble({
  children,
  side,
}: {
  children: React.ReactNode;
  side: "left" | "right";
}) {
  if (side === "left") {
    return (
      <div className="flex items-end gap-2">
        <Avatar hue={330} hue2={280} className="h-7 w-7" label="Léa" />
        <p className="max-w-[78%] rounded-2xl rounded-bl-md bg-white/10 px-3.5 py-2.5">
          {children}
        </p>
      </div>
    );
  }
  return (
    <div className="flex justify-end">
      <p className="max-w-[78%] rounded-2xl rounded-br-md bg-gradient-to-br from-[#2f8bff] to-[#1d6dff] px-3.5 py-2.5 text-white">
        {children}
      </p>
    </div>
  );
}

/* ───────────────────────── Event (White & Pen) ───────────────────────── */
export function EventScreen() {
  return (
    <div className="absolute inset-0 bg-ink text-white">
      <StatusBar time="11:54" />
      <div className="px-5 pt-3">
        <h3 className="font-display text-2xl">Genève</h3>
        <div className="mt-2 flex items-center gap-4 text-[13px] font-semibold">
          <span className="relative pb-1">
            Toutes
            <span className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-neon" />
          </span>
          <span className="pb-1 text-white/45">Réservées</span>
          <span className="pb-1 text-white/45">Passées</span>
        </div>
      </div>

      <div className="mx-4 mt-4 overflow-hidden rounded-3xl border border-white/10">
        <div className="relative h-56">
          <CrowdBackdrop from={20} to={300} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="font-display text-4xl leading-none tracking-tight">
                WHITE
              </p>
              <p className="font-display text-4xl leading-none gradient-text">
                &amp; PEN
              </p>
            </div>
          </div>
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-ink/80 px-2.5 py-1 text-[11px] font-semibold">
            <Users className="h-3.5 w-3.5 text-neon" /> 12 amis y vont
          </span>
        </div>
        <div className="space-y-3 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="flex items-center gap-1 text-sm font-bold">
                White &amp; Pen Lausanne <MapPin className="h-3.5 w-3.5 text-neon" />
              </p>
              <p className="text-xs text-neon">27/06 · 22h00</p>
            </div>
            <p className="font-display text-lg gradient-text">CHF 96</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex-1 rounded-full bg-neon-gradient py-2.5 text-center text-sm font-bold">
              Réserver
            </button>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-neon text-white">
              <QrCode className="h-5 w-5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── Login (logo) ───────────────────────── */
export function LoginScreen() {
  return (
    <div className="absolute inset-0 bg-ink text-white">
      <CrowdBackdrop from={280} to={320} />
      <StatusBar time="20:37" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-7 text-center">
        <BrandMark className="h-20 w-20 animate-float" />
        <p className="mt-3 font-display text-3xl">
          One<span className="gradient-text">Night.</span>
        </p>
        <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
          Feel the night, share the vibe
        </p>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
          Meet <span className="text-neon">your tribe</span>
        </p>

        <div className="mt-auto mb-8 w-full space-y-3">
          <button className="w-full rounded-2xl bg-violet py-3.5 text-sm font-bold">
            Login as a Nighter
          </button>
          <button className="w-full rounded-2xl bg-white/10 py-3.5 text-sm font-bold">
            Login as Host
          </button>
        </div>
      </div>
    </div>
  );
}
