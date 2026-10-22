import { Building2, Cpu, Handshake } from "lucide-react";
import type { ReactNode } from "react";
import { ContactForm } from "../components/ContactForm";
import { Container } from "../components/ui";
import { site } from "../config/site";

const KINDS: { icon: ReactNode; title: string; text: string }[] = [
  { icon: <Handshake size={22} />, title: "Plateformes de mobilité", text: "Étudier ensemble des intégrations autorisées, dans le respect de leurs conditions et des données des chauffeurs." },
  { icon: <Building2 size={22} />, title: "Acteurs du secteur", text: "Loueurs, gestionnaires de flottes, assureurs, organisations de chauffeurs : améliorer la connaissance des coûts réels." },
  { icon: <Cpu size={22} />, title: "Partenaires technologiques", text: "Cartographie, données de circulation, infrastructure : fiabiliser les estimations avec des sources sérieuses." },
];

const AMBITIONS = [
  "Évaluer les possibilités d’intégration autorisée",
  "Tester le concept sur un périmètre pilote",
  "Mesurer la valeur réelle pour les chauffeurs",
  "Construire une solution fiable et conforme aux règles applicables",
];

export function Partners() {
  return (
    <section id="partenaires" aria-labelledby="partners-title" className="relative py-24 sm:py-32">
      <Container>
        <div className="max-w-3xl">
          <h2 id="partners-title" className="display text-[clamp(2.1rem,5vw,3.6rem)]">
            Construisons-le avec les acteurs de la mobilité.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            VTC Copilot AI recherche des partenaires pour tester le concept et le rendre utile à grande échelle. Aucun partenariat n’est conclu à ce jour : nous n’affichons que ce qui est confirmé.
          </p>
        </div>

        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {KINDS.map((k) => (
            <li key={k.title} className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6">
              <span className="grid size-12 place-items-center rounded-2xl bg-[linear-gradient(135deg,rgba(124,92,255,0.25),rgba(56,182,255,0.2))] text-text" aria-hidden>
                {k.icon}
              </span>
              <h3 className="mt-5 text-xl font-semibold">{k.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{k.text}</p>
            </li>
          ))}
        </ul>

        <div className="mt-6 grid gap-6 rounded-[28px] border border-white/10 bg-[linear-gradient(160deg,rgba(22,34,79,0.8),rgba(10,17,48,0.8))] p-6 sm:p-9 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          <div>
            <h3 className="text-2xl font-semibold">Notre démarche</h3>
            <ol className="mt-5 space-y-4">
              {AMBITIONS.map((a, i) => (
                <li key={a} className="flex gap-4">
                  <span className="grid size-8 flex-none place-items-center rounded-full border border-white/20 text-sm font-semibold tabular" aria-hidden>
                    {i + 1}
                  </span>
                  <span className="pt-1 leading-relaxed">{a}</span>
                </li>
              ))}
            </ol>
            {site.contact.email && (
              <p className="mt-6 text-muted">
                Ou écrivez-nous :{" "}
                <a className="text-signal underline underline-offset-4" href={`mailto:${site.contact.email}`}>
                  {site.contact.email}
                </a>
              </p>
            )}
          </div>
          <div>
            <h3 className="text-2xl font-semibold">Proposer un échange</h3>
            <p className="mb-5 mt-2 text-muted">Partenaires, presse ou question sur vos données : un message suffit.</p>
            <ContactForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
