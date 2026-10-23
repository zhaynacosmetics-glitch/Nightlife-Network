import { Logo } from "../../shared/Logo";
import { site } from "../config/site";
import { Container } from "./ui";

const LINKS = [
  { href: "/#faq", label: "FAQ" },
  { href: "/#partenaires", label: "Partenaires et contact" },
  { href: "/confidentialite/", label: "Confidentialité" },
  { href: "/mentions-legales/", label: "Mentions légales" },
];

export function Footer() {
  return (
    <footer className="border-t border-line py-10" style={{ paddingBottom: "max(2.5rem, env(safe-area-inset-bottom))" }}>
      <Container className="flex flex-col gap-6 md:flex-row md:items-center">
        <Logo size={26} id="footer" />
        <nav aria-label="Liens du site" className="md:ml-auto">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[14px] text-muted">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a className="hover:text-ink" href={l.href}>
                  {l.label}
                </a>
              </li>
            ))}
            {site.contact.email && (
              <li>
                <a className="hover:text-ink" href={`mailto:${site.contact.email}`}>
                  {site.contact.email}
                </a>
              </li>
            )}
          </ul>
        </nav>
      </Container>
      <Container className="mt-8">
        <p className="text-[12.5px] leading-relaxed text-muted">
          © 2026 VTC Copilot AI · Projet en préparation, démonstrations avec des données fictives. Uber, Bolt et Heetch sont des marques de leurs propriétaires respectifs ; aucun partenariat n’est conclu
          avec ces sociétés.
        </p>
      </Container>
    </footer>
  );
}
