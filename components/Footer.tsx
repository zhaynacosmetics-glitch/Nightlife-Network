import Link from "next/link";
import { Logo } from "./ui";

const groups = [
  {
    title: "Produit",
    links: [
      { label: "Fonctionnalités", href: "#features" },
      { label: "En direct", href: "#live" },
      { label: "Comment ça marche", href: "#how" },
      { label: "Télécharger", href: "#download" },
    ],
  },
  {
    title: "Soirées",
    links: [
      { label: "White & Pen", href: "#" },
      { label: "Oriental Party", href: "#" },
      { label: "Années 80", href: "#" },
      { label: "Devenir Host", href: "#" },
    ],
  },
  {
    title: "Entreprise",
    links: [
      { label: "À propos", href: "#" },
      { label: "Carrières", href: "#" },
      { label: "Presse", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Légal",
    links: [
      { label: "Confidentialité", href: "#" },
      { label: "Conditions", href: "#" },
      { label: "Cookies", href: "#" },
      { label: "Sécurité", href: "#" },
    ],
  },
];

const socials = ["Instagram", "TikTok", "Snapchat", "X"];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_repeat(4,1fr)]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-white/55">
              Le réseau social de soirées. Rencontre les personnes croisées
              lors de tes soirées préférées.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {socials.map((s) => (
                <Link
                  key={s}
                  href="#"
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70 transition-colors hover:border-neon/40 hover:text-white"
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>

          {groups.map((g) => (
            <nav key={g.title} aria-label={g.title}>
              <h3 className="text-sm font-bold text-white">{g.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {g.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-white/55 transition-colors hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-white/45">
            © {new Date().getFullYear()} One Night. Tous droits réservés.
          </p>
          <p className="text-xs text-white/45">
            Conçu pour celles et ceux qui vivent la nuit. 🍸
          </p>
        </div>
      </div>
    </footer>
  );
}
