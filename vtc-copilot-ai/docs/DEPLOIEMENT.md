# Déploiement sur Cloudflare (gratuit)

L'hébergement se fait sur **Cloudflare Workers**, qui sert les fichiers statiques et l'API, avec une base **D1**. Le plan gratuit suffit :

- fichiers statiques gratuits et illimités ;
- 100 000 requêtes d'API par jour ;
- D1 : 5 Go, 5 millions de lectures et 100 000 écritures par jour.

Pas de Netlify, pas de nom de domaine acheté. Aucun service payant n'est nécessaire.

## Ce qui est déjà fait

- La base D1 **`vtc-copilot-ai-waitlist`** existe déjà sur le compte Cloudflare (id `574d8a13-ad7c-4e51-9155-5d04382d01d8`).
  - Le schéma y est appliqué, et la migration `0001_init.sql` est enregistrée comme appliquée.
  - La base est vide.
- `wrangler.jsonc` est prêt : nom `vtc-copilot-ai`, liaison D1, fichiers statiques dans `dist/` et routes `/api/*` servies par le Worker.

## Ce qui reste à faire : une action humaine (environ 10 minutes)

L'environnement de travail de Claude n'a pas de jeton API Cloudflare capable de publier un Worker. C'est la seule étape qui bloque.

### Option A : depuis le tableau de bord Cloudflare (recommandée, sans terminal)

1. Sur dash.cloudflare.com, ouvrir **Workers & Pages**, puis **Create**, puis **Import a repository**, et connecter GitHub.
2. Choisir le dépôt `zhaynacosmetics-glitch/Nightlife-Network` et remplir les réglages suivants :

   | Réglage | Valeur |
   | --- | --- |
   | Branche de production | celle où le site a été fusionné (`claude/install-ui-ux-pro-max-lh5m21`, ou la branche de la PR pour tester avant fusion) |
   | Root directory | `vtc-copilot-ai` |
   | Build command | `npm run build` |
   | Deploy command | `npx wrangler deploy` |

3. Lancer le déploiement. Cloudflare affiche une URL du type `https://vtc-copilot-ai.<votre-sous-domaine>.workers.dev`.

   L'écran d'import ne propose pas de choisir la branche : Cloudflare prend la branche par défaut du dépôt. Tant que la PR n'est pas fusionnée, ce premier build échoue à l'étape « Cloning ». Dans ce cas, ouvrir le Worker, onglet **Settings**, rubrique **Build**, puis **Branch control**, et choisir la branche du site comme **Production branch**. Le build suivant part automatiquement au prochain push sur cette branche.
4. Ouvrir le Worker, puis **Settings**, puis **Variables and Secrets**, et ajouter deux **secrets** (type *Secret*, pas *Text*) :

   | Secret | Valeur | Rôle |
   | --- | --- | --- |
   | `ADMIN_TOKEN` | une longue valeur aléatoire (32 caractères ou plus) | Protège l'export de la waitlist. À garder dans un gestionnaire de mots de passe. |
   | `IP_HASH_SALT` | une autre valeur aléatoire | Sert à la limitation de débit. Sans lui, un sel par défaut est utilisé, ce qui est moins sûr. |

5. Dans **Settings**, puis **Build**, puis **Variables**, ajouter la variable de build `SITE_URL` avec l'URL obtenue à l'étape 3, puis relancer un déploiement. Cette variable active les balises canonical, les balises Open Graph et le `sitemap.xml`.

### Option B : depuis un terminal

```bash
cd vtc-copilot-ai
npm install
npx wrangler login                 # ouvre le navigateur pour autoriser
npx wrangler secret put ADMIN_TOKEN
npx wrangler secret put IP_HASH_SALT
SITE_URL=https://vtc-copilot-ai.<sous-domaine>.workers.dev npm run deploy
```

`npm run deploy` enchaîne trois étapes : le build, les migrations D1 distantes (déjà appliquées, donc sans effet) et la publication.

## Vérifier après le déploiement

1. Ouvrir l'URL, puis vérifier que le film se lance et que la démo défile.
2. `https://<url>/api/health` doit répondre `{"ok":true}`.
3. Faire une inscription test, puis la supprimer avec le lien personnel affiché.
4. Récupérer l'export avec la commande ci-dessous. Elle doit renvoyer un CSV vide, ou le CSV de l'inscription test si elle n'a pas été supprimée.

   ```bash
   curl -H "Authorization: Bearer $ADMIN_TOKEN" "https://<url>/api/admin/export?type=waitlist" -o waitlist.csv
   ```

## Avant d'annoncer le site publiquement

- **Mentions légales.** Renseigner l'éditeur (nom ou raison sociale, statut, SIREN, adresse, directeur de la publication) dans `src/config/site.ts`, bloc `legal`. Tant que ce bloc est vide, les pages affichent « À compléter ».
- **Contact.** Renseigner `contact.email` dans le même fichier. Le formulaire de contact fonctionne même sans cette adresse.
- **Compteur d'inscrits.** Mettre à jour `waitlist.verifiedSignups` uniquement avec un chiffre réel, lu dans D1. Tant que la valeur reste `null`, seul l'objectif de 10 000 est affiché.

  ```bash
  npx wrangler d1 execute vtc-copilot-ai-waitlist --remote --command "SELECT COUNT(*) FROM waitlist"
  ```

- **Turnstile (facultatif, gratuit)** : un anti-robot plus fort que les protections déjà en place.
  1. Créer un widget dans Cloudflare, rubrique Turnstile.
  2. Mettre la clé publique dans `turnstileSiteKey`, dans `site.ts`.
  3. Ajouter le secret `TURNSTILE_SECRET_KEY` au Worker.
- **Données en Europe.** La base a été créée avec une préférence de localisation en Europe de l'Ouest (WEUR), sans juridiction UE stricte. Pour garantir un stockage dans l'UE, il faut créer une nouvelle base avec `--jurisdiction eu`, avant toute inscription réelle, puis mettre son id dans `wrangler.jsonc`.
- **Nom de domaine.** Rien n'a été acheté. Si un domaine est acquis plus tard, il suffit de l'ajouter au Worker, dans **Settings**, puis **Domains & Routes**, et de mettre à jour `SITE_URL`.

## Maintenance

| Besoin | Commande |
| --- | --- |
| Exporter la waitlist (CSV) | `curl -H "Authorization: Bearer $ADMIN_TOKEN" "https://<url>/api/admin/export?type=waitlist" -o waitlist.csv` |
| Exporter les messages de contact | `…/api/admin/export?type=contact&format=json` |
| Statistiques | `…/api/admin/stats` (même en-tête) |
| Supprimer une personne à sa demande | `npx wrangler d1 execute vtc-copilot-ai-waitlist --remote --command "DELETE FROM waitlist WHERE email = 'adresse@exemple.fr'"` |
| Suivre les erreurs | Tableau de bord du Worker, onglet **Observability** (les logs sont activés) |

Les données sont conservées au plus 24 mois après le lancement (`retentionMonths` dans `site.ts`), comme l'indique la page de confidentialité. La purge est manuelle :

```sql
DELETE FROM waitlist WHERE created_at < datetime('now', '-24 months');
```

## Licence Remotion

Le film déjà rendu (MP4) peut être utilisé librement. Pour le **regénérer**, Remotion est gratuit jusqu'à 3 salariés. Au-delà, une licence entreprise est nécessaire.
