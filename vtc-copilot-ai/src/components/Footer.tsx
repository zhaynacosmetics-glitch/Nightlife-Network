import { Logo } from "../../shared/Logo";
import { site } from "../config/site";
import { Container } from "./ui";

export function Footer() {
  return (
    <footer className="border-t border-white/8 py-14" style={{ paddingBottom: "max(3.5rem, env(safe-area-inset-bottom))" }}>
      <Container className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <Logo size={32} id="footer" />
          <p className="mt-4 max-w-[38ch] text-[15px] leading-relaxed text-muted">
            Le copilote de rentabilité des chauffeurs VTC. Projet en préparation pour l’Île-de-France. Démonstrations réalisées avec des données fictives.
          </p>
        </div>
        <nav aria-label="Liens du site">
          <h2 className="text-sm font-semibold text-text">Le projet</h2>
          <ul className="mt-4 space-y-2.5 text-[15px] text-muted">
            <li><a className="hover:text-text" href="/#solution">Solution</a></li>
            <li><a className="hover:text-text" href="/#demo">Démonstration</a></li>
            <li><a className="hover:text-text" href="/#waitlist">Waitlist</a></li>
            <li><a className="hover:text-text" href="/#faq">FAQ</a></li>
          </ul>
        </nav>
        <nav aria-label="Informations">
          <h2 className="text-sm font-semibold text-text">Informations</h2>
          <ul className="mt-4 space-y-2.5 text-[15px] text-muted">
            <li><a className="hover:text-text" href="/#partenaires">Contact et partenariats</a></li>
            {site.contact.email && (
              <li><a className="hover:text-text" href={`mailto:${site.contact.email}`}>{site.contact.email}</a></li>
            )}
            <li><a className="hover:text-text" href="/confidentialite/">Politique de confidentialité</a></li>
            <li><a className="hover:text-text" href="/mentions-legales/">Mentions légales</a></li>
          </ul>
        </nav>
      </Container>
      <Container className="mt-12">
        <div className="flex flex-col gap-2 border-t border-white/8 pt-6 text-[13px] text-muted sm:flex-row sm:justify-between">
          <p>© 2026 VTC Copilot AI</p>
          <p>Uber, Bolt et Heetch sont des marques de leurs propriétaires respectifs. Aucun partenariat n’est conclu avec ces sociétés.</p>
        </div>
      </Container>
    </footer>
  );
}
