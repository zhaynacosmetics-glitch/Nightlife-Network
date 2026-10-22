import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "../../shared/Logo";
import { site } from "../config/site";
import { ButtonLink, Container } from "./ui";

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 border-b ${
        scrolled || open ? "bg-night/85 backdrop-blur-xl border-white/8" : "bg-transparent border-transparent"
      }`}
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <Container className="flex h-[72px] items-center gap-6">
        <a href="/" className="rounded-lg" aria-label="VTC Copilot AI, accueil">
          <Logo size={34} id="nav" />
        </a>
        <nav aria-label="Navigation principale" className="ml-auto hidden md:block">
          <ul className="flex items-center gap-1">
            {site.nav.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="rounded-full px-4 py-2 text-[15px] text-muted transition-colors hover:text-text">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="hidden md:block">
          <ButtonLink href="/#waitlist" className="!min-h-11 !px-5">
            Rejoindre la waitlist
          </ButtonLink>
        </div>
        <button
          type="button"
          className="ml-auto grid size-11 place-items-center rounded-full border border-white/15 md:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
        </button>
      </Container>
      <div id="menu-mobile" hidden={!open} className="md:hidden border-t border-white/8 bg-night/95">
        <Container className="flex flex-col gap-1 py-4">
          {site.nav.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-xl px-3 py-3.5 text-lg text-text hover:bg-white/5">
              {l.label}
            </a>
          ))}
          <ButtonLink href="/#waitlist" onClick={() => setOpen(false)} className="mt-3">
            Rejoindre la waitlist
          </ButtonLink>
        </Container>
      </div>
    </header>
  );
}
