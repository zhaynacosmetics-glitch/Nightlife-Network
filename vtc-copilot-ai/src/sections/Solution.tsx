import { Clock3, Gauge, MapPin, Navigation, SlidersHorizontal, Wallet } from "lucide-react";
import type { ReactNode } from "react";
import { C, VERDICT, seg } from "../../shared/brand";
import { Phone } from "../../shared/Phone";
import { AnalysisScreen } from "../../shared/screens";
import { Container, useProgress } from "../components/ui";

const INPUTS: { icon: ReactNode; label: string; hint: string }[] = [
  { icon: <Wallet size={18} />, label: "Prix proposé", hint: "le montant de la proposition" },
  { icon: <Navigation size={18} />, label: "Approche", hint: "distance et temps jusqu’au client" },
  { icon: <Clock3 size={18} />, label: "Durée et distance", hint: "le temps total mobilisé" },
  { icon: <MapPin size={18} />, label: "Destination", hint: "et les possibilités de retour" },
  { icon: <SlidersHorizontal size={18} />, label: "Vos coûts", hint: "configurés une fois, ajustables" },
  { icon: <Gauge size={18} />, label: "Vos préférences", hint: "vos seuils, vos zones" },
];

const OUTPUTS = [
  { v: "green" as const, text: "La course couvre vos coûts et dépasse le seuil que vous avez fixé." },
  { v: "orange" as const, text: "Le résultat est proche de votre seuil : un élément mérite votre attention." },
  { v: "red" as const, text: "Une fois l’approche, le temps et les coûts intégrés, le gain estimé est faible." },
];

export function Solution() {
  const { ref, p } = useProgress({ duration: 3.6 });

  return (
    <section id="solution" aria-labelledby="solution-title" className="relative bg-mist py-24 text-ink sm:py-32">
      <Container>
        <div className="max-w-3xl">
          <h2 id="solution-title" className="display text-[clamp(2.1rem,5vw,3.6rem)]">
            Un copilote qui fait le calcul pendant que vous conduisez.
          </h2>
          <p className="mt-6 max-w-[58ch] text-lg leading-relaxed text-slate">
            VTC Copilot AI rassemble les informations d’une proposition, applique vos propres coûts et vous présente une lecture simple en trois couleurs. C’est un outil d’aide à la décision : il ne promet aucun gain et
            n’accepte jamais une course à votre place.
          </p>
        </div>

        <div ref={ref} className="mt-16 grid items-center gap-12 lg:grid-cols-[1fr_auto_1fr] lg:gap-10">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1" aria-label="Ce que le copilote prend en compte">
            {INPUTS.map((it, i) => {
              const t = seg(p, i * 0.05, 0.2 + i * 0.05);
              return (
                <li
                  key={it.label}
                  className="relative flex items-center gap-4 rounded-2xl border border-ink/8 bg-white px-4 py-3.5 shadow-[0_8px_24px_-18px_rgba(10,15,38,0.45)]"
                  style={{ transform: `translateX(${(1 - t) * -10}px)` }}
                >
                  <span
                    className="grid size-10 flex-none place-items-center rounded-xl transition-colors duration-300"
                    style={{ background: t > 0.5 ? C.violet : "rgba(124,92,255,0.1)", color: t > 0.5 ? "#fff" : C.violet }}
                    aria-hidden
                  >
                    {it.icon}
                  </span>
                  <span>
                    <span className="block font-semibold">{it.label}</span>
                    <span className="block text-[15px] text-slate">{it.hint}</span>
                  </span>
                  <span
                    aria-hidden
                    className="absolute -right-10 top-1/2 hidden h-px w-10 origin-left lg:block"
                    style={{ background: `linear-gradient(90deg, ${C.violet}, transparent)`, transform: `scaleX(${seg(p, 0.15 + i * 0.04, 0.4 + i * 0.04)})` }}
                  />
                </li>
              );
            })}
          </ul>

          <div className="mx-auto">
            <Phone width={300} label="Écran d’analyse : décomposition du prix, coûts estimés et taux horaire net estimé (données fictives)">
              <AnalysisScreen p={seg(p, 0.15, 1)} />
            </Phone>
          </div>

          <ul className="flex flex-col gap-3" aria-label="Les trois lectures possibles">
            {OUTPUTS.map((o, i) => {
              const t = seg(p, 0.7 + i * 0.08, 0.85 + i * 0.08);
              return (
                <li key={o.v} className="rounded-2xl border bg-white p-5 transition-[border-color,box-shadow] duration-500" style={{ borderColor: t > 0.5 ? `${VERDICT[o.v].color}88` : "rgba(10,15,38,0.08)", boxShadow: t > 0.5 ? `0 12px 30px -20px ${VERDICT[o.v].color}` : "none" }}>
                  <span className="flex items-center gap-2.5 font-semibold">
                    <span className="size-3 rounded-full" style={{ background: VERDICT[o.v].color, boxShadow: `0 0 0 4px ${VERDICT[o.v].color}33` }} aria-hidden />
                    {VERDICT[o.v].label}
                  </span>
                  <p className="mt-2 text-[15px] leading-relaxed text-slate">{o.text}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}
