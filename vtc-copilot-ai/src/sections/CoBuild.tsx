import { Container } from "../components/ui";

const STEPS = [
  { title: "Écouter", text: "Des entretiens avec des chauffeurs franciliens pour comprendre comment ils jugent une course aujourd’hui et ce qui leur manque." },
  { title: "Prototyper", text: "Un modèle de calcul transparent et des réglages de coûts que chacun peut comprendre et ajuster." },
  { title: "Tester", text: "Un périmètre pilote avec des volontaires de la waitlist, pour mesurer ce que l’outil apporte vraiment." },
  { title: "Ajuster", text: "Chaque retour fait évoluer le produit. Rien n’est figé avant d’avoir été éprouvé sur le terrain." },
];

export function CoBuild() {
  return (
    <section id="co-construction" aria-labelledby="cobuild-title" className="bg-mist py-24 text-ink sm:py-32">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <h2 id="cobuild-title" className="display text-[clamp(2.1rem,5vw,3.6rem)]">
              Conçu avec les chauffeurs, pas seulement pour eux.
            </h2>
            <p className="mt-6 max-w-[48ch] text-lg leading-relaxed text-slate">
              Les réalités économiques du métier varient d’un chauffeur à l’autre : véhicule, statut, horaires, zones. Le copilote doit s’adapter à chacun. C’est pourquoi nous le construisons avec celles et ceux qui conduisent.
            </p>
            <p className="mt-6 max-w-[48ch] rounded-2xl border border-ink/10 bg-white p-5 text-[15px] leading-relaxed text-slate">
              Pas de témoignages ici pour l’instant : le produit est en préparation. Nous publierons uniquement des retours réels, avec l’accord de leurs auteurs.
            </p>
          </div>
          <ol className="relative grid gap-4 sm:grid-cols-2">
            {STEPS.map((s, i) => (
              <li key={s.title} className="rounded-[24px] border border-ink/8 bg-white p-6 shadow-[0_10px_30px_-24px_rgba(10,15,38,0.5)]">
                <span className="grid size-10 place-items-center rounded-full bg-ink text-sm font-bold text-white tabular" aria-hidden>
                  {i + 1}
                </span>
                <h3 className="mt-5 text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-slate">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
