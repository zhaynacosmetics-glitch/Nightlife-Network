# VTC Copilot AI — site officiel

Site de présentation de **VTC Copilot AI**, le copilote d’aide à la décision qui aide les chauffeurs VTC d’Île-de-France à évaluer la rentabilité de chaque proposition de course.

> Ce dossier est indépendant du reste du dépôt (`Nightlife-Network` héberge à sa racine un autre projet, « One Night »). Tout ce qui concerne VTC Copilot AI se trouve ici.

## Contenu

| Élément | Emplacement |
| --- | --- |
| Site (React + Vite, pré-rendu statique) | `src/` |
| Écrans de l’application, logo, couleurs, données de démo (partagés site + film) | `shared/` |
| Configuration centrale (textes, liens, contact, objectif, nombre réel d’inscrits, médias) | [`src/config/site.ts`](src/config/site.ts) |
| API waitlist + contact (Cloudflare Worker) | `worker/index.ts` |
| Schéma de base de données (D1) | `migrations/` |
| Film motion design de 20 s (sources Remotion) | `video/` |
| Film final (master 1080p) | [`video/out/vtc-copilot-ai-film-master-1080p.mp4`](video/out/vtc-copilot-ai-film-master-1080p.mp4) |
| Versions web du film, affiche, image de partage | `public/media/` |
| Storyboard avec timecodes | [`video/STORYBOARD.md`](video/STORYBOARD.md) |
| Stack, skills et licences | [`docs/STACK-AND-SKILLS.md`](docs/STACK-AND-SKILLS.md) |
| Rapport de tests | [`docs/TEST-REPORT.md`](docs/TEST-REPORT.md) |
| Déploiement et maintenance | [`docs/DEPLOIEMENT.md`](docs/DEPLOIEMENT.md) |
| Captures de validation | `docs/screenshots/` |
| Variables et secrets attendus (sans valeur) | [`.env.example`](.env.example) |

## Démarrer en local

Prérequis : Node.js 20 ou plus.

```bash
cd vtc-copilot-ai
npm install
cp .env.example .dev.vars        # puis renseigner ADMIN_TOKEN et IP_HASH_SALT (valeurs de test)
npm run build                    # build + pré-rendu dans dist/
npm run db:migrate:local         # crée la base D1 locale
npm run preview                  # site + API sur http://localhost:8787
```

Pour travailler sur l’interface avec rechargement à chaud : `npm run preview` dans un terminal, `npm run dev` dans un autre (http://localhost:5173, les appels `/api` sont relayés vers le port 8787).

## Commandes

| Commande | Effet |
| --- | --- |
| `npm run build` | Build client + build SSR + pré-rendu de chaque page (`dist/`) |
| `npm run typecheck` | Vérification TypeScript (site + Worker) |
| `npm run lint` | ESLint |
| `npm run test:unit` | Tests unitaires (validation, modèle de calcul de la démo) |
| `npm run test:e2e` | Tests Playwright de bout en bout (desktop + mobile, accessibilité axe) |
| `npm test` | Tout ce qui précède, dans l’ordre |
| `npm run preview` | Worker + site + D1 locale (`wrangler dev`) |
| `npm run deploy` | Build, migrations D1 distantes, déploiement Cloudflare |
| `node scripts/screenshots.mjs` | Captures sur 5 tailles d’écran (film, 7 écrans, inscription, fenêtres) |

Film : scénario dans [`video/SCENARIO.md`](video/SCENARIO.md), découpage dans [`video/STORYBOARD.md`](video/STORYBOARD.md) (`npm run studio`, `npm run render` dans `video/`).

## Modifier les contenus

- **Textes de marque, contact, mentions légales, objectif, zones, médias** : `src/config/site.ts`.
- **Nombre d’inscrits affiché** : `waitlist.verifiedSignups` dans `src/config/site.ts`. Laisser `null` tant que le chiffre n’est pas vérifié ; seul l’objectif de 10 000 est alors affiché, comme objectif.
- **Page d’accueil en trois temps** : `src/sections/Hero.tsx` (film), `src/sections/Story.tsx` (problème puis solution, 7 écrans au défilement), `src/sections/Join.tsx` (inscription). FAQ : `src/content/faq.ts`, affichée dans une fenêtre (`src/components/Dialogs.tsx`), comme le contact partenaires.
- **Écrans de l’application et données de démo** : `shared/screens.tsx`, `shared/coach.tsx` (coach IA, contexte, pop-up de verdict, notifications), `shared/demo.ts` (modifie à la fois le site et le film).
- **Typographie française** : `node scripts/typo-fr.cjs src/**/*.tsx` ajoute les espaces insécables avant `: ; ? !`.

## Waitlist : fonctionnement

- Formulaire : prénom, e-mail, zone (facultative), consentement obligatoire aux informations de lancement, consentement facultatif aux tests.
- Validation identique côté navigateur et côté serveur (`src/lib/validation.ts`), e-mails normalisés (minuscules, Unicode NFKC).
- Doublons impossibles (contrainte `UNIQUE` sur l’e-mail) ; la personne est informée qu’elle est déjà inscrite.
- Anti-abus : champ piège invisible, délai minimal de remplissage, vérification de l’origine, limitation de débit par empreinte d’IP hachée et salée (purgée après 24 h), Cloudflare Turnstile en option.
- Suppression en libre-service : un lien personnel est donné après l’inscription (seule l’empreinte SHA-256 du jeton est stockée).
- Export sécurisé : `GET /api/admin/export?type=waitlist|contact&format=csv|json` avec l’en-tête `Authorization: Bearer <ADMIN_TOKEN>`. Sans ce secret, l’export est désactivé. CSV protégé contre l’injection de formules.

```bash
curl -H "Authorization: Bearer $ADMIN_TOKEN" "https://<url-du-site>/api/admin/export?type=waitlist" -o waitlist.csv
# ou directement dans D1 :
npx wrangler d1 execute vtc-copilot-ai-waitlist --remote --command "SELECT email, first_name, zone, created_at FROM waitlist"
```

## Règles de véracité appliquées

- 10 000 chauffeurs est présenté comme un **objectif** ; aucun compteur n’est affiché sans chiffre réel vérifié.
- Aucun témoignage, aucune statistique, aucun logo de partenaire inventés.
- Aucune intégration Uber, Bolt ou Heetch n’est présentée comme opérationnelle ; aucune disponibilité sur les stores n’est annoncée.
- Toutes les données de démonstration sont signalées comme fictives, à l’écran comme dans le film. Les écrans « contexte » (trafic, météo, vols) et le pop-up au-dessus d’une proposition sont présentés comme un concept : aucune donnée réelle n’est branchée et la proposition affichée est une interface générique, sans marque de plateforme.
- Les mentions légales affichent « À compléter » tant que l’éditeur n’est pas renseigné dans la configuration.
