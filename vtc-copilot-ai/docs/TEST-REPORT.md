# Rapport de tests

Date : 22 octobre 2026. Tous les résultats ci-dessous ont été obtenus **en local** : le site tournait dans `wrangler dev`, qui simule le Worker Cloudflare et la base D1. Aucun test n'a encore été lancé sur une URL publique, parce que le site n'est pas encore déployé (voir [DEPLOIEMENT.md](DEPLOIEMENT.md)).

## Synthèse

Toutes les commandes ont été relancées après les dernières modifications.

| Contrôle | Commande | Résultat |
| --- | --- | --- |
| TypeScript (site + Worker) | `npm run typecheck` | OK, 0 erreur |
| Lint | `npm run lint` | OK, 0 erreur, 0 avertissement |
| Build + pré-rendu | `npm run build` | OK, 5 pages générées |
| Tests unitaires (validation, normalisation, modèle de calcul) | `npm run test:unit` | 7 réussis sur 7 |
| Tests de bout en bout Playwright (desktop + mobile Pixel 7) | `npm run test:e2e` | 44 réussis, 2 ignorés par conception (un test réservé au desktop et un test réservé au mobile) |
| Lighthouse mobile | voir plus bas | Performance 97 · Accessibilité 100 · Bonnes pratiques 100 · SEO 100 |
| Lighthouse desktop | voir plus bas | 100 · 100 · 100 · 100 |
| Film | `ffprobe` | 20,000 s, 600 images, 1920 × 1080, H.264 High, yuv420p |

## Ce que couvrent les tests de bout en bout

Les fichiers sont dans `tests/e2e/`.

- **Pages et SEO**
  - Les 4 pages se chargent sans erreur dans la console, avec un seul h1.
  - Le HTML pré-rendu contient le contenu même sans JavaScript.
  - Une adresse inconnue renvoie une vraie 404, et `robots.txt` est servi.
  - Les balises SEO (titre, description, JSON-LD, `noindex` de `/desinscription/`) ont été vérifiées à la main dans le HTML généré, et sont validées par le score SEO de 100 de Lighthouse.
- **Liens**
  - Toutes les ancres internes pointent vers une section existante.
  - Tous les liens internes et tous les médias (MP4, WebM, affiche, image de partage) répondent en 200.
- **Accessibilité** : audit axe-core WCAG 2.1 A et AA sur chaque page, sans aucune violation. On y vérifie aussi le lien d'évitement « Aller au contenu » et le menu mobile.
- **Responsive** : aucun débordement horizontal à 320 px de large.
- **Film**
  - Il démarre au clic et se met en pause.
  - On vérifie sa durée (environ 20 s), son ratio 16:9 et son mode muet.
- **Démo à 4 slides**
  - Boutons précédent et suivant, onglets, flèches du clavier.
  - Défilement automatique, que l'on peut mettre en pause.
  - Avec `prefers-reduced-motion`, aucun défilement automatique et les écrans sont affichés directement à leur état final.
- **Waitlist**
  - Le formulaire affiche ses erreurs côté navigateur.
  - Parcours complet : inscription, deuxième inscription signalée comme doublon, suppression par lien personnel, puis réutilisation du lien refusée.
- **Formulaire de contact** : un envoi valide est accepté.
- **Protections de l'API**
  - Origine étrangère refusée (403).
  - Corps non JSON refusé (415).
  - Envoi trop rapide refusé (429).
  - Champ piège : l'envoi semble accepté mais rien n'est enregistré.
  - Mauvaise méthode refusée (405).
- **Export administrateur**
  - Refusé sans jeton (401).
  - Avec le jeton, le CSV est conforme et les formules tableur y sont neutralisées.

## Contrôles manuels de l'API (curl, en local)

| Cas | Réponse obtenue |
| --- | --- |
| Inscription valide | 201, jeton de suppression fourni, e-mail stocké en minuscules |
| Même e-mail en majuscules | 200, « déjà inscrit·e », aucune seconde ligne |
| E-mail invalide, consentement absent | 400, message par champ |
| Champ piège rempli | 201 simulé, aucune écriture en base |
| Envoi en moins de 1,5 s | 429 |
| En-tête Origin étranger | 403 |
| Plus de 5 inscriptions en 10 min depuis la même IP | 429 |
| `GET /api/admin/export` sans jeton | 401 |
| `GET /api/admin/export` avec jeton | CSV, un nom `=CMD()` exporté en `'=CMD()` |

## Lighthouse

Lighthouse a tourné sur `http://localhost:8787` avec le Chromium de l'environnement. Les rapports complets sont dans `docs/lighthouse/mobile.html` et `docs/lighthouse/desktop.html`.

| Profil | Performance | Accessibilité | Bonnes pratiques | SEO | FCP | LCP | TBT | CLS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Mobile (4G simulée, CPU ×4) | 97 | 100 | 100 | 100 | 1,9 s | 2,3 s | 30 ms | 0 |
| Desktop | 100 | 100 | 100 | 100 | 0,5 s | — | — | 0 |

Les vrais en-têtes Cloudflare (compression Brotli, HTTP/3, cache) ne sont pas simulés en local. Les scores en ligne devraient donc être égaux ou meilleurs, mais il faudra le vérifier après le déploiement.

## Captures d'écran

Les captures sont dans `docs/screenshots/` et ont été générées par `node scripts/screenshots.mjs`.

- **Cinq tailles d'écran** : 320, 390, 820, 1366 et 1920 px de large. Pour chacune : la page entière, le haut de page, la waitlist, la FAQ et le pied de page.
- **Démo** : les 4 slides, sur mobile 390 px et sur laptop 1366 px.
- **Waitlist** : l'état « erreurs » et l'état « confirmation », sur mobile 390 px et sur laptop 1366 px.
- **Film** : `film-planche-contact.jpg`, une image toutes les 2 secondes.

## Limites connues

- **Aucune vérification en ligne.** Le site n'est pas déployé, et l'environnement de travail bloque l'accès à `*.workers.dev`. Après le déploiement, il faudra :
  - ouvrir l'URL ;
  - faire une inscription réelle, puis la supprimer ;
  - relancer Lighthouse sur l'URL publique.
- **Codecs vidéo.** Le Chromium de test ne lit pas le H.264, donc les tests de lecture ont utilisé la version WebM. Le MP4 a été validé par `ffprobe`. Chrome, Safari, Firefox et Edge lisent le MP4 H.264.
- **Turnstile.** Il est désactivé tant que les clés ne sont pas définies, et son parcours n'a donc pas été testé de bout en bout.
- **Envoi d'e-mails.** Aucun e-mail n'est envoyé. La confirmation se fait à l'écran, avec un lien de suppression personnel.
