import { Reveal } from "./Reveal";
import { Pill } from "./ui";
import { Avatar } from "./PhoneFrame";
import { Star } from "./icons";

const reviews = [
  {
    name: "Sarah",
    age: 24,
    hue: 330,
    soiree: "White & Pen Lausanne",
    text: "J'ai retrouvé le mec que j'avais croisé toute la soirée sans oser lui parler. On s'est matchés le lendemain 🙈",
  },
  {
    name: "Lucas",
    age: 27,
    hue: 220,
    soiree: "Oriental Party Genève",
    text: "Le live avant la soirée c'est addictif. Tu vois l'ambiance, tu réserves, t'es dedans. Plus jamais sans.",
  },
  {
    name: "Inès",
    age: 23,
    hue: 280,
    soiree: "Années 80 Paris",
    text: "Voir quels amis vont à quelle soirée a changé mes weekends. On se retrouve tous au même endroit maintenant.",
  },
  {
    name: "Maxime",
    age: 29,
    hue: 20,
    soiree: "Rooftop Sessions",
    text: "Réservation en 1 clic, QR code direct dans l'app, zéro file d'attente. C'est exactement ce qu'il manquait.",
  },
  {
    name: "Léa",
    age: 24,
    hue: 300,
    soiree: "White & Pen Lausanne",
    text: "Heureuse qu'on se parle enfin 🙌 L'app rend les rencontres en soirée tellement plus simples.",
  },
];

export function Testimonials() {
  return (
    <section id="avis" className="relative overflow-hidden bg-lilac py-24 text-ink sm:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Pill className="border-ink/10 bg-white text-neon-deep">
            <Star className="h-4 w-4" /> Ils vivent la night
          </Pill>
          <h2 className="display mt-5 text-5xl uppercase sm:text-6xl">
            Des soirées.
            <span className="gradient-text"> Des rencontres.</span> Des souvenirs.
          </h2>
        </Reveal>
      </div>

      {/* Marquee of reviews */}
      <div className="mask-fade-x mt-14 overflow-hidden">
        <div className="flex w-max animate-marquee gap-5 pr-5">
          {[...reviews, ...reviews].map((r, i) => (
            <figure
              key={i}
              className="w-[320px] shrink-0 rounded-3xl border border-ink/5 bg-white p-6 shadow-card"
            >
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="h-4 w-4" />
                ))}
              </div>
              <blockquote className="mt-3 text-[15px] leading-relaxed text-ink/80">
                “{r.text}”
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <Avatar hue={r.hue} className="h-10 w-10" label={r.name} />
                <div className="leading-tight">
                  <p className="text-sm font-bold">
                    {r.name}, {r.age}
                  </p>
                  <p className="text-xs text-neon-deep">{r.soiree}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
