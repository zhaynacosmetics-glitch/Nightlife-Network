import type { ReactNode } from "react";
import { Container } from "../components/ui";
import { site } from "../config/site";

export function Prose({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="pb-24 pt-[calc(64px+4rem+env(safe-area-inset-top))]">
      <Container className="max-w-[820px]">
        <h1 className="display text-[clamp(2.4rem,6vw,3.8rem)]">{title}</h1>
        <div className="prose-legal mt-10 space-y-6 text-[16.5px] leading-relaxed text-muted [&_a]:text-violet [&_a]:underline [&_h2]:mt-10 [&_h2]:text-[22px] [&_h2]:font-semibold [&_h2]:tracking-[-0.02em] [&_h2]:text-ink [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-ink">
          {children}
        </div>
      </Container>
    </section>
  );
}

const missing = (v: string) => v || "À compléter par l’éditeur avant diffusion publique";

export function Legal() {
  const l = site.legal;
  return (
    <Prose title="Mentions légales">
      <p>Dernière mise à jour : {l.lastUpdate}.</p>
      <h2>Éditeur du site</h2>
      <ul>
        <li>Éditeur : {missing(l.publisher)}</li>
        <li>Statut juridique : {missing(l.status)}</li>
        <li>Adresse : {missing(l.address)}</li>
        <li>Immatriculation : {missing(l.registration)}</li>
        <li>Directeur ou directrice de la publication : {missing(l.publicationDirector)}</li>
        <li>Contact : {site.contact.email ? <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a> : <a href="/#partenaires">formulaire de contact</a>}</li>
      </ul>
      <h2>Hébergement</h2>
      <p>{l.host}</p>
      <h2>Propriété intellectuelle</h2>
      <p>
        Les textes, illustrations, interfaces, animations et le film de présentation de VTC Copilot AI ont été créés spécifiquement pour ce site. Toute reproduction sans autorisation est interdite. Les écrans de
        l’application sont des démonstrations de concept réalisées avec des données fictives.
      </p>
      <h2>Marques citées</h2>
      <p>Uber, Bolt et Heetch sont des marques de leurs propriétaires respectifs. Leur mention sert uniquement à informer ; elle ne signifie aucun partenariat ni aucune approbation.</p>
      <h2>Données personnelles</h2>
      <p>
        Voir la <a href="/confidentialite/">politique de confidentialité</a>.
      </p>
    </Prose>
  );
}
