import type { ComponentType } from "react";
import { site } from "./config/site";
import { Home } from "./pages/Home";
import { Legal } from "./pages/Legal";
import { NotFound } from "./pages/NotFound";
import { Privacy } from "./pages/Privacy";
import { Unsubscribe } from "./pages/Unsubscribe";

export interface Route {
  path: string;
  /** Fichier HTML généré dans dist/. */
  file: string;
  title: string;
  description: string;
  Page: ComponentType;
  index: boolean;
}

export const ROUTES: Route[] = [
  {
    path: "/",
    file: "index.html",
    title: "VTC Copilot AI · L’assistant de rentabilité des chauffeurs VTC en Île-de-France",
    description: site.description,
    Page: Home,
    index: true,
  },
  {
    path: "/confidentialite/",
    file: "confidentialite/index.html",
    title: "Politique de confidentialité · VTC Copilot AI",
    description: "Quelles données VTC Copilot AI collecte, pourquoi, combien de temps elles sont conservées et comment exercer vos droits.",
    Page: Privacy,
    index: true,
  },
  {
    path: "/mentions-legales/",
    file: "mentions-legales/index.html",
    title: "Mentions légales · VTC Copilot AI",
    description: "Éditeur, hébergement et informations légales du site VTC Copilot AI.",
    Page: Legal,
    index: true,
  },
  {
    path: "/desinscription/",
    file: "desinscription/index.html",
    title: "Supprimer mon inscription · VTC Copilot AI",
    description: "Supprimer votre inscription à la waitlist VTC Copilot AI.",
    Page: Unsubscribe,
    index: false,
  },
  {
    path: "/404",
    file: "404.html",
    title: "Page introuvable · VTC Copilot AI",
    description: "Cette page n’existe pas.",
    Page: NotFound,
    index: false,
  },
];

export function routeFor(pathname: string): Route {
  const p = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return ROUTES.find((r) => r.path === p || r.path === pathname) ?? ROUTES[ROUTES.length - 1];
}
