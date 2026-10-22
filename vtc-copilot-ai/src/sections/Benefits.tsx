import { BarChart3, Eye, Lightbulb, Settings2, Timer } from "lucide-react";
import type { ReactNode } from "react";
import { fmtEUR } from "../../shared/brand";
import { Container } from "../components/ui";

const ITEMS: { icon: ReactNode; title: string; text: string }[] = [
  { icon: <Eye size={20} />, title: "Comprendre chaque proposition", text: "Le prix, l’approche, la durée et la destination réunis sur un seul écran lisible." },
  { icon: <Lightbulb size={20} />, title: "Décider de façon plus éclairée", text: "Une lecture en trois couleurs et les raisons qui la justifient, sans jamais décider pour vous." },
  { icon: <BarChart3 size={20} />, title: "Suivre votre rentabilité", text: "Un historique pour voir, sur la semaine, quelles courses ont réellement compté." },
  { icon: <Settings2 size={20} />, title: "Adapter l’analyse à vos préférences", text: "Vos seuils, vos zones, votre façon de travailler : l’analyse suit vos règles." },
  { icon: <Timer size={20} />, title: "Gagner du temps de décision", text: "Les calculs sont faits en amont : il vous reste l’essentiel à lire." },
];

const COSTS = [
  { label: "Énergie", value: 0.11, share: 0.34 },
  { label: "Entretien et pneus", value: 0.07, share: 0.22 },
  { label: "Assurance", value: 0.06, share: 0.19 },
  { label: "Véhicule (location ou crédit)", value: 0.08, share: 0.25 },
];

export function Benefits() {
  return (
    <section id="benefices" aria-labelledby="benefices-title" className="bg-mist py-24 text-ink sm:py-32">
      <Container>
        <h2 id="benefices-title" className="display max-w-3xl text-[clamp(2.1rem,5vw,3.6rem)]">
          Ce que le copilote change dans votre journée.
        </h2>

        <div className="mt-14 grid gap-5 lg:grid-cols-[1.05fr_1fr]">
          {/* Bénéfice principal, illustré par l'écran de réglage des coûts */}
          <article className="relative overflow-hidden rounded-[28px] bg-ink p-7 text-text sm:p-9">
            <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-[radial-gradient(closest-side,rgba(124,92,255,0.45),transparent)]" />
            <h3 className="display relative text-[clamp(1.6rem,3vw,2.2rem)]">Intégrer vos coûts réels</h3>
            <p className="relative mt-3 max-w-[44ch] leading-relaxed text-muted">
              Vous renseignez une fois ce que vous coûte votre activité. Chaque proposition est ensuite évaluée avec vos chiffres, pas avec une moyenne.
            </p>
            <div className="relative mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-5" role="img" aria-label="Exemple d’écran de réglage des coûts : énergie 0,11 €, entretien 0,07 €, assurance 0,06 €, véhicule 0,08 € par kilomètre, soit 0,32 € par kilomètre (valeurs fictives).">
              <div className="flex items-baseline justify-between text-sm text-muted">
                <span>Vos coûts par km</span>
                <span>Valeurs fictives</span>
              </div>
              <div className="mt-4 space-y-4">
                {COSTS.map((c) => (
                  <div key={c.label}>
                    <div className="flex justify-between text-[15px]">
                      <span>{c.label}</span>
                      <span className="font-semibold tabular">{fmtEUR(c.value)}</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-[linear-gradient(90deg,var(--color-violet),var(--color-signal))]" style={{ width: `${c.share * 100 * 2.4}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-baseline justify-between border-t border-white/10 pt-4">
                <span className="text-muted">Total appliqué</span>
                <span className="display text-3xl tabular">{fmtEUR(0.32)}/km</span>
              </div>
            </div>
          </article>

          <ul className="grid gap-px overflow-hidden rounded-[28px] border border-ink/8 bg-ink/8">
            {ITEMS.map((it) => (
              <li key={it.title} className="flex gap-4 bg-white p-6">
                <span className="grid size-11 flex-none place-items-center rounded-xl bg-violet/10 text-violet" aria-hidden>
                  {it.icon}
                </span>
                <div>
                  <h3 className="text-lg font-semibold">{it.title}</h3>
                  <p className="mt-1 leading-relaxed text-slate">{it.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-6 text-sm text-slate">Aucun gain n’est garanti : VTC Copilot AI fournit des estimations destinées à éclairer vos choix.</p>
      </Container>
    </section>
  );
}
