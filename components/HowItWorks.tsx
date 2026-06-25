import { Reveal } from "./Reveal";
import { Pill } from "./ui";
import { Ticket, Martini, Heart } from "./icons";

const steps = [
  {
    n: "01",
    icon: <Ticket className="h-6 w-6" />,
    title: "Réserve ta soirée",
    desc: "Choisis une soirée à thème, vois quels amis y vont et réserve ta place en un clic.",
  },
  {
    n: "02",
    icon: <Martini className="h-6 w-6" />,
    title: "Vis la night",
    desc: "Profite de l'ambiance, scanne ton QR à l'entrée et croise du monde sur place.",
  },
  {
    n: "03",
    icon: <Heart className="h-6 w-6" />,
    title: "Match après la fête",
    desc: "Retrouve les personnes rencontrées, débloque tes matchs et continue l'aventure.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative bg-ink py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Pill>Comment ça marche</Pill>
          <h2 className="display mt-5 text-5xl uppercase text-white sm:text-6xl">
            Trois étapes,
            <br />
            <span className="gradient-text">zéro prise de tête.</span>
          </h2>
        </Reveal>

        <div className="relative mt-16 grid gap-6 md:grid-cols-3">
          {/* connecting line */}
          <div
            aria-hidden
            className="absolute left-0 right-0 top-9 hidden h-px bg-gradient-to-r from-transparent via-neon/40 to-transparent md:block"
          />
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <div className="relative h-full rounded-4xl border border-white/10 bg-white/[0.03] p-8 text-center md:text-left">
                <div className="flex items-center justify-between">
                  <span className="relative z-10 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-neon-gradient text-white shadow-glow">
                    {s.icon}
                  </span>
                  <span className="font-display text-5xl text-white/10">{s.n}</span>
                </div>
                <h3 className="mt-6 text-xl font-bold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  {s.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
