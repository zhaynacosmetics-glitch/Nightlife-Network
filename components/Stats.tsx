import { Reveal } from "./Reveal";

const stats = [
  { value: "12 000+", label: "membres actifs" },
  { value: "340", label: "soirées par mois" },
  { value: "85 000", label: "matchs débloqués" },
  { value: "4,9★", label: "note moyenne" },
];

export function Stats() {
  return (
    <section className="bg-ink pb-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-4xl border border-white/10 bg-white/5 sm:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06}>
              <div className="bg-ink/60 px-6 py-8 text-center">
                <p className="font-display text-4xl gradient-text sm:text-5xl">
                  {s.value}
                </p>
                <p className="mt-1 text-sm font-medium text-white/55">
                  {s.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
