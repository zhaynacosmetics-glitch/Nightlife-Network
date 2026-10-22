import { motion, useReducedMotion } from "motion/react";
import { Clock3, Compass, Fuel, Navigation, TrendingUp } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { Container } from "../components/ui";

const HIDDEN: { icon: ReactNode; title: string; text: string }[] = [
  { icon: <Clock3 size={20} />, title: "Le temps de décision", text: "Quelques secondes pour juger une proposition, souvent en conduisant, sans pouvoir tout calculer." },
  { icon: <Navigation size={20} />, title: "La distance d’approche", text: "Les kilomètres et les minutes avant la prise en charge ne sont pas payés au même titre que la course." },
  { icon: <Fuel size={20} />, title: "Vos coûts réels", text: "Énergie, entretien, assurance, location ou crédit du véhicule : chaque kilomètre a un coût." },
  { icon: <Compass size={20} />, title: "L’incertitude de la destination", text: "Une course qui vous éloigne peut se terminer par un long retour à vide." },
  { icon: <TrendingUp size={20} />, title: "La rentabilité globale", text: "Difficile de savoir, en fin de journée, quelles courses ont vraiment compté." },
];

export function Problem() {
  const reduced = useReducedMotion();
  return (
    <section id="probleme" aria-labelledby="probleme-title" className="relative py-24 sm:py-32">
      <Container className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 id="probleme-title" className="display text-[clamp(2.1rem,5vw,3.6rem)]">
            La notification montre un prix. Pas ce qu’il reste.
          </h2>
          <p className="mt-6 max-w-[48ch] text-lg leading-relaxed text-muted">
            Un montant affiché en gros ne dit rien du temps total mobilisé, des kilomètres à vide ni de ce que coûte réellement votre véhicule. Ces éléments décident pourtant de la rentabilité d’une course.
          </p>
        </div>

        {/* Illustration : ce qui est visible au-dessus de la ligne, ce qui compte en dessous */}
        <div className="relative">
          <div className="relative mx-auto max-w-[520px] rounded-[26px] border border-white/14 bg-[linear-gradient(180deg,#16224f,#10193f)] p-6 shadow-[0_30px_80px_-30px_rgba(124,92,255,0.8)]">
            <div className="flex items-center gap-3 text-sm text-muted">
              <span className="rounded-full bg-signal px-3 py-1 text-[13px] font-bold text-night">Nouvelle course</span>
              Exemple fictif
            </div>
            <p className="display mt-3 text-6xl tabular">32,00&nbsp;€</p>
            <p className="mt-1 text-muted">Ce que vous voyez</p>
          </div>

          <div className="relative my-8 flex items-center gap-4" aria-hidden>
            <span className="h-px flex-1 bg-[linear-gradient(90deg,transparent,var(--color-signal))]" />
            <span className="text-sm font-semibold text-signal">Ce qui compte</span>
            <span className="h-px flex-1 bg-[linear-gradient(90deg,var(--color-signal),transparent)]" />
          </div>

          <ul className="relative space-y-3">
            {HIDDEN.map((h, i) => (
              <motion.li
                key={h.title}
                initial={reduced ? false : { y: 22, scale: 0.98 }}
                whileInView={{ y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 lg:ml-(--indent)"
                style={{ "--indent": `${Math.min(i, 4) * 3}%` } as CSSProperties}
              >
                <span className="grid size-11 flex-none place-items-center rounded-xl bg-violet/15 text-violet-soft" aria-hidden>
                  {h.icon}
                </span>
                <div>
                  <h3 className="text-lg font-semibold">{h.title}</h3>
                  <p className="mt-1 leading-relaxed text-muted">{h.text}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
