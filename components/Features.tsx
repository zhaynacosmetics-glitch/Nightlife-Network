import { Reveal } from "./Reveal";
import { Pill } from "./ui";
import { ChatScreen } from "./screens";
import { Avatar } from "./PhoneFrame";
import {
  Live,
  Heart,
  Ticket,
  Chat,
  Shield,
  Bolt,
  Sparkles,
  Users,
} from "./icons";

function MiniCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition-colors duration-300 hover:border-neon/40 hover:bg-white/[0.05]">
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-neon-gradient text-white">
        {icon}
      </span>
      <h3 className="mt-4 text-lg font-bold text-white">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-white/60">{desc}</p>
    </div>
  );
}

export function Features() {
  return (
    <section id="features" className="relative bg-ink py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Pill>
            <Sparkles className="h-4 w-4 text-neon" /> Tout pour la night
          </Pill>
          <h2 className="display mt-5 text-5xl uppercase text-white sm:text-6xl">
            Une app de soirées ?<br />
            <span className="gradient-text">Le réseau social</span> de soirées.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/60">
            Des soirées. Des rencontres. Des souvenirs. One Night réunit tout
            ce qu&apos;il faut pour vivre la nuit à fond.
          </p>
        </Reveal>

        {/* Bento */}
        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {/* Big: Live */}
          <Reveal className="lg:col-span-2">
            <div className="relative h-full overflow-hidden rounded-4xl border border-white/10 bg-gradient-to-br from-violet-deep/40 to-ink p-8">
              <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-neon/20 blur-3xl" />
              <div className="relative max-w-md">
                <span className="inline-flex items-center gap-2 rounded-full bg-neon px-3 py-1 text-xs font-bold text-white">
                  <Live className="h-3.5 w-3.5" /> LIVE
                </span>
                <h3 className="display mt-4 text-3xl uppercase text-white sm:text-4xl">
                  La soirée commence ici.
                </h3>
                <p className="mt-3 text-white/70">
                  Découvre les soirées en direct, ressens l&apos;ambiance avant
                  même d&apos;y être, et réserve ta place en un seul clic.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {["En direct", "Réserve en 1 clic", "Ambiance live", "Tonight"].map(
                    (t) => (
                      <span
                        key={t}
                        className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/70"
                      >
                        {t}
                      </span>
                    ),
                  )}
                </div>
              </div>
              <div className="pointer-events-none absolute bottom-0 right-6 hidden translate-y-8 sm:block">
                <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-card">
                  <Avatar hue={30} className="h-8 w-8" />
                  <div className="leading-tight">
                    <p className="text-sm font-bold text-ink">Emma vient de réserver</p>
                    <p className="text-[11px] text-ink/50">il y a 30 sec</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Match */}
          <Reveal delay={0.05}>
            <div className="flex h-full flex-col rounded-4xl border border-white/10 bg-white/[0.03] p-8">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-neon-gradient text-white">
                <Heart className="h-5 w-5" />
              </span>
              <h3 className="display mt-4 text-2xl uppercase text-white">
                Match après la night
              </h3>
              <p className="mt-2 text-sm text-white/60">
                Tu as croisé quelqu&apos;un sans oser lui parler ? Retrouve-le et
                débloque le match grâce à vos soirées en commun.
              </p>
              <div className="mt-auto pt-6">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70">
                  <Users className="h-3.5 w-3.5 text-neon" /> 2 soirées en commun
                </span>
              </div>
            </div>
          </Reveal>

          {/* Themed event with phone */}
          <Reveal delay={0.05}>
            <div className="relative h-full overflow-hidden rounded-4xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-ink p-8">
              <h3 className="display text-2xl uppercase text-white">
                Réserve une soirée à thème
              </h3>
              <p className="mt-2 text-sm text-white/60">
                White &amp; Pen, Oriental Party, Années 80… Découvre des soirées
                vraiment uniques près de chez toi.
              </p>
              <div className="mt-6 flex items-center gap-3 text-sm text-white/70">
                <Ticket className="h-5 w-5 text-neon" /> Billetterie + QR code intégrés
              </div>
            </div>
          </Reveal>

          {/* Chat phone showcase spanning 2 */}
          <Reveal delay={0.1} className="lg:col-span-2">
            <div className="relative grid h-full items-center gap-6 overflow-hidden rounded-4xl border border-white/10 bg-gradient-to-br from-ink to-violet-deep/30 p-8 sm:grid-cols-2">
              <div>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-neon-gradient text-white">
                  <Chat className="h-5 w-5" />
                </span>
                <h3 className="display mt-4 text-3xl uppercase text-white">
                  Ce n&apos;était que le début.
                </h3>
                <p className="mt-3 text-white/70">
                  Continue l&apos;aventure après la soirée. Discute, fais
                  connaissance et prévois la prochaine night ensemble.
                </p>
              </div>
              <div className="relative mx-auto hidden h-[280px] w-full max-w-[260px] sm:block">
                <div className="absolute left-1/2 top-0 w-[260px] -translate-x-1/2 overflow-hidden rounded-[2rem] border border-white/10 shadow-phone">
                  <div className="relative h-[420px] w-[260px] scale-100">
                    <ChatScreen />
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Secondary feature row */}
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Reveal>
            <MiniCard
              icon={<Bolt className="h-5 w-5" />}
              title="Réservation en 1 clic"
              desc="Le verre rose : réserve ta place instantanément, paiement sécurisé inclus."
            />
          </Reveal>
          <Reveal delay={0.05}>
            <MiniCard
              icon={<Users className="h-5 w-5" />}
              title="Tes amis y vont"
              desc="Vois qui de ton réseau participe à chaque soirée avant de réserver."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <MiniCard
              icon={<Shield className="h-5 w-5" />}
              title="Profils vérifiés"
              desc="Une communauté safe : vérification d'identité et modération active."
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
