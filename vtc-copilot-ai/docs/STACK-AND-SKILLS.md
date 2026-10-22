# Stack technique et skills retenus

Recherche menée le 22 octobre 2026. Règle suivie : peu de ressources, toutes vérifiées (dépôt, licence, compatibilité) et réellement utilisées. Une distinction est faite entre les **skills** (instructions pour un agent IA, qui ne s’exécutent pas) et les **bibliothèques** (du code exécuté dans le site, le Worker ou le rendu vidéo).

## 1. Skills d’agent (instructions)

Installés dans `.claude/skills/` à la racine du dépôt, lus en entier avant usage.

| Skill | Source | Licence | Utilité pour ce projet | Comment il a été utilisé |
| --- | --- | --- | --- | --- |
| `frontend-design` | [anthropics/skills](https://github.com/anthropics/skills) | Apache-2.0 | Éviter le rendu « page générée » : plan de design avant le code, typographie choisie, audace concentrée sur un seul élément, liste des clichés à éviter. | Plan de design écrit avant le code (palette de 6 tons, une seule famille typographique Archivo en deux largeurs, le film comme élément mémorable). Clichés évités : pas de surtitres en capitales, pas de flèche ajoutée aux boutons, numérotation réservée aux vraies séquences (étapes de démo, démarche). Revue par captures d’écran à chaque passe. |
| `web-design-guidelines` | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | MIT | Grille de revue UI (accessibilité, focus, formulaires, animations, typographie, performances). | Règles récupérées depuis `vercel-labs/web-interface-guidelines` et appliquées : `aria-label` sur les boutons-icônes, erreurs inline avec focus sur le premier champ, `autocomplete`/`inputMode`/`spellCheck`, `…` typographique, `tabular-nums`, `text-wrap: balance`, `color-scheme: dark`, `theme-color`, `touch-action: manipulation`, lecture vidéo avec contrôle pause, rien en `transition: all`. |
| `remotion-best-practices` | [remotion-dev/skills](https://github.com/remotion-dev/skills) (monorepo Remotion) | Licence Remotion | Bonnes pratiques Remotion : animations pilotées par `useCurrentFrame()`/`interpolate()` (pas de CSS animé), tailles de texte vidéo, rendu d’images fixes pour contrôle. | Toutes les animations du film sont pilotées par la frame ; tailles de titres ≥ 112 px en 1920 px ; contrôle par `renderStill` à des instants clés avant le rendu final. |
| `ui-ux-pro-max` | déjà présent dans le dépôt | MIT | Base de règles UX (contraste, cibles tactiles 44 px, états de focus). | Utilisé comme liste de contrôle finale. Ses recommandations de palette (« premium dark + gold ») ont été écartées : elles contredisaient le brief. |

Écarté : `webapp-testing` (anthropics/skills) — utile mais orienté scripts Python ; les tests sont écrits directement avec Playwright Test en TypeScript. `ibelick/ui` — collection de composants à copier-coller, pas un skill ; pas de composant repris tel quel, le style est spécifique à la marque.

## 2. Bibliothèques et outils exécutés

| Outil | Version | Licence | Rôle | Pourquoi |
| --- | --- | --- | --- | --- |
| [React](https://react.dev) | 19.3 | MIT | Interface du site et du film | Composants partagés entre site et film (écrans de l’app). |
| [Vite](https://vite.dev) | 8.3 | MIT | Build du site + build SSR pour le pré-rendu | Rapide, simple ; le pré-rendu (`scripts/prerender.mjs`) produit un HTML complet par page pour le SEO et l’affichage sans JavaScript. |
| TypeScript | 6.0 | Apache-2.0 | Typage strict | 6.0 plutôt que 7 : `typescript-eslint` ne supporte pas encore la 7. |
| [Tailwind CSS](https://tailwindcss.com) | 4.3 | MIT | Système de styles | Jetons de couleur dans `@theme` (`src/styles/global.css`). |
| [Motion](https://github.com/motiondivision/motion) | 14.6 | MIT | Animations d’interface (slides, apparitions, progression) | Respecte `prefers-reduced-motion` via `useReducedMotion`. |
| [Lucide](https://github.com/lucide-icons/lucide) | 1.61 | ISC | Icônes homogènes | Aucun emoji utilisé comme icône. |
| Archivo (Fontsource) | 5.3 | OFL-1.1 | Typographie variable (graisse + largeur) | Une seule famille : largeur 118–125 % pour les titres, 100 % pour le texte. Auto-hébergée (pas d’appel à Google Fonts). |
| [Remotion](https://github.com/remotion-dev/remotion) | 4.0.537 | Licence Remotion (voir ci-dessous) | Rendu du film MP4 depuis React | Le film réutilise les vrais écrans de l’app du site. |
| FFmpeg | 6.1 (système) | LGPL/GPL | Déclinaisons web (H.264 faststart, WebM VP9), affiche, image de partage | Outil standard, local, gratuit. |
| [Cloudflare Workers + static assets](https://developers.cloudflare.com/workers/static-assets/) | — | Service | Hébergement du site et de l’API | Fichiers statiques gratuits et illimités ; 100 000 requêtes Worker/jour en gratuit (seules les routes `/api/*` en consomment). Cloudflare oriente désormais les nouveaux projets vers Workers plutôt que Pages. |
| [Cloudflare D1](https://developers.cloudflare.com/d1/) | — | Service | Stockage de la waitlist et des messages | Gratuit : 5 Go, 5 M lectures et 100 000 écritures par jour. |
| Wrangler | 4.151 | MIT / Apache-2.0 | Dev local (Worker + D1 simulés) et déploiement | |
| [Playwright Test](https://github.com/microsoft/playwright) | 1.56.1 | Apache-2.0 | Tests de bout en bout et captures | Version alignée sur le Chromium préinstallé de l’environnement. |
| [@axe-core/playwright](https://github.com/dequelabs/axe-core-npm) | 4.14 | MPL-2.0 | Audit d’accessibilité WCAG 2.1 AA | |
| ESLint + typescript-eslint + react-hooks | 10 / 8.72 / 7.1 | MIT | Lint | |

### Licence Remotion

Remotion est gratuit pour les particuliers, les entreprises à but lucratif de 3 salariés au plus, les associations, et pour l’évaluation. Au-delà, une licence entreprise est requise (remotion.pro). Si VTC Copilot AI dépasse 3 salariés, il faudra soit acquérir cette licence pour **regénérer** le film, soit conserver le MP4 déjà rendu (le fichier livré n’impose aucune licence au site). Aucune autre dépendance n’entraîne de coût.

### Son du film

Aucune musique ni effet sonore : aucune bibliothèque audio libre de droits n’a été vérifiée dans le cadre de ce travail, et le site lit le film en silence. Le film est conçu pour être compris sans son. Une piste peut être ajoutée plus tard dans `video/src/Film.tsx` (composant `<Audio>` de `@remotion/media`) avec une musique dont la licence est vérifiée.
