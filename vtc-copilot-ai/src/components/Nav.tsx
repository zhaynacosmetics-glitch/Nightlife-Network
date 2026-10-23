import { useEffect, useState } from "react";
import { Logo } from "../../shared/Logo";
import { site } from "../config/site";
import { ButtonLink, Container } from "./ui";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-300 ${scrolled ? "border-line bg-white/85 backdrop-blur-xl" : "border-transparent bg-transparent"}`}
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <Container className="flex h-16 items-center gap-4">
        <a href="/" className="rounded-lg" aria-label="VTC Copilot AI, accueil">
          <Logo size={30} id="nav" />
        </a>
        <nav aria-label="Navigation principale" className="ml-auto hidden md:block">
          <ul className="flex items-center gap-1">
            {site.nav.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="rounded-full px-4 py-2 text-[14.5px] text-muted transition-colors hover:text-ink">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <ButtonLink href="/#waitlist" className="ml-auto !min-h-10 !px-4 !text-[14px] md:ml-2 md:!px-5">
          <span>
            Rejoindre<span className="hidden sm:inline"> la waitlist</span>
          </span>
        </ButtonLink>
      </Container>
    </header>
  );
}
