"use client";

import { motion, useReducedMotion } from "framer-motion";
import { PhoneFrame, Avatar } from "./PhoneFrame";
import { LiveFeedScreen } from "./screens";
import { StoreButtons, Pill } from "./ui";
import { Star, Users, Eye, Heart, Martini } from "./icons";

function FloatCard({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6 + delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`absolute z-20 ${className}`}
    >
      <div className={reduce ? "" : "animate-float"} style={{ animationDelay: `${delay}s` }}>
        {children}
      </div>
    </motion.div>
  );
}

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-ink pb-20 pt-28 sm:pt-36">
      {/* background glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-violet/30 blur-[120px]" />
        <div className="absolute right-0 top-40 h-[28rem] w-[28rem] rounded-full bg-neon/25 blur-[130px]" />
        <div className="absolute inset-0 grain opacity-[0.06]" />
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(60% 50% at 50% 0%, #000, transparent)",
            WebkitMaskImage: "radial-gradient(60% 50% at 50% 0%, #000, transparent)",
          }}
        />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-2 lg:gap-6">
        {/* Copy */}
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center lg:justify-start"
          >
            <Pill>
              <Users className="h-4 w-4 text-neon" />
              +12 000 membres font déjà la fête
            </Pill>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="display mt-6 text-[15vw] uppercase text-white sm:text-7xl lg:text-[5.4rem]"
          >
            Un match
            <br />
            <span className="gradient-text">après la night.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-white/70 lg:mx-0"
          >
            Le réseau social de soirées. Retrouve les personnes croisées
            pendant tes soirées préférées et continue l&apos;aventure après la
            fête.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-8 flex flex-col items-center gap-4 lg:items-start"
          >
            <StoreButtons />
            <div className="flex items-center gap-3 text-sm text-white/60">
              <div className="flex -space-x-2">
                <Avatar hue={330} className="h-7 w-7 ring-2 ring-ink" />
                <Avatar hue={270} className="h-7 w-7 ring-2 ring-ink" />
                <Avatar hue={210} className="h-7 w-7 ring-2 ring-ink" />
                <Avatar hue={20} className="h-7 w-7 ring-2 ring-ink" />
              </div>
              <span className="flex items-center gap-1">
                <span className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4" />
                  ))}
                </span>
                <strong className="text-white">4,9</strong> · 2 300 avis
              </span>
            </div>
          </motion.div>
        </div>

        {/* Phone */}
        <div className="relative flex justify-center lg:justify-end">
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40, rotate: -3 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <PhoneFrame>
              <LiveFeedScreen />
            </PhoneFrame>
          </motion.div>

          <FloatCard className="-left-2 top-24 sm:left-0" delay={0.1}>
            <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-card">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neon/15 text-neon">
                <Eye className="h-4 w-4" />
              </span>
              <div className="text-left leading-tight">
                <p className="text-sm font-bold text-ink">127 personnes</p>
                <p className="text-[11px] text-ink/60">regardent en direct</p>
              </div>
            </div>
          </FloatCard>

          <FloatCard className="-right-1 top-40 sm:right-0" delay={0.5}>
            <div className="rounded-2xl bg-white px-3 py-2 shadow-card">
              <p className="flex items-center gap-1.5 text-sm font-bold text-violet">
                <Users className="h-4 w-4" /> 18 amis sont là
              </p>
              <div className="mt-1 flex -space-x-1.5">
                {[300, 260, 220, 20].map((h) => (
                  <Avatar key={h} hue={h} className="h-5 w-5 ring-2 ring-white" />
                ))}
                <span className="flex h-5 items-center rounded-full bg-violet px-1.5 text-[9px] font-bold text-white">
                  +13
                </span>
              </div>
            </div>
          </FloatCard>

          <FloatCard className="bottom-10 left-2 sm:-left-6" delay={0.8}>
            <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-card">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neon-gradient text-white">
                <Heart className="h-4 w-4" />
              </span>
              <div className="flex items-center gap-1 text-left">
                <p className="text-sm font-bold text-ink">+284 réactions</p>
              </div>
            </div>
          </FloatCard>

          <FloatCard className="bottom-32 right-0 sm:-right-4" delay={1.1}>
            <div className="rounded-2xl bg-white px-3 py-2 shadow-card">
              <p className="flex items-center gap-1.5 text-sm font-bold text-ink">
                <Martini className="h-4 w-4 text-neon" /> Réservé
              </p>
              <p className="text-[11px] text-ink/60">via le verre rose 🍸</p>
            </div>
          </FloatCard>
        </div>
      </div>
    </section>
  );
}
