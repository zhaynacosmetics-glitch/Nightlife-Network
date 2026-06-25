import { Reveal } from "./Reveal";
import { PhoneFrame, Avatar } from "./PhoneFrame";
import { EventScreen } from "./screens";
import { Users, Eye, MapPin } from "./icons";

export function Showcase() {
  return (
    <section
      id="live"
      className="relative overflow-hidden bg-lilac py-24 text-ink sm:py-32"
    >
      {/* hand-drawn-ish doodles */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-10 top-20 h-40 w-40 rounded-full bg-neon/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-52 w-52 rounded-full bg-violet/10 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 lg:grid-cols-2">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-neon-deep">
            <MapPin className="h-4 w-4" /> Genève · Lausanne · Paris
          </span>
          <h2 className="display mt-5 text-5xl uppercase sm:text-6xl">
            Réserve une
            <br />
            <span className="gradient-text">soirée à thème.</span>
          </h2>
          <p className="mt-5 max-w-md text-lg text-ink/70">
            Parcours les soirées en direct, vois combien d&apos;amis y vont et
            réserve ta place en un clic. Ton billet et ton QR code t&apos;attendent
            dans l&apos;app.
          </p>

          <ul className="mt-8 space-y-3">
            {[
              "Soirées exclusives et thématiques près de chez toi",
              "Compteur d'amis présents en temps réel",
              "Billet + QR code générés instantanément",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-ink/80">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neon-gradient text-white">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="m5 12 5 5 9-10" />
                  </svg>
                </span>
                <span className="font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1} className="relative flex justify-center lg:justify-end">
          <div className="relative">
            <PhoneFrame glow={false}>
              <EventScreen />
            </PhoneFrame>

            <div className="absolute -left-4 top-28 z-20 animate-float">
              <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-card">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neon/15 text-neon">
                  <Users className="h-4 w-4" />
                </span>
                <p className="text-sm font-bold">12 amis y vont</p>
              </div>
            </div>

            <div
              className="absolute -right-3 bottom-28 z-20 animate-float"
              style={{ animationDelay: "0.8s" }}
            >
              <div className="rounded-2xl bg-white px-3 py-2 shadow-card">
                <p className="flex items-center gap-1.5 text-sm font-bold text-neon-deep">
                  <Eye className="h-4 w-4" /> 352 en direct
                </p>
                <div className="mt-1 flex -space-x-1.5">
                  {[330, 280, 30].map((h) => (
                    <Avatar key={h} hue={h} className="h-5 w-5 ring-2 ring-white" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
