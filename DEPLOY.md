# Déployer One Night sur Cloudflare Pages

Le site est un **export statique** Next.js (`output: "export"` → dossier `out/`).
Cloudflare Pages se contente donc de servir des fichiers statiques : rapide,
gratuit, et sans runtime serveur.

---

## Option A — Dashboard Cloudflare (recommandé, aucun secret à partager)

Cette méthode connecte ton dépôt GitHub : chaque `git push` redéploie tout seul.

1. Va sur **https://dash.cloudflare.com** → **Workers & Pages** → **Create** →
   onglet **Pages** → **Connect to Git**.
2. Autorise GitHub et sélectionne le dépôt **`Nightlife-Network`**.
3. Choisis la branche `claude/ultimate-builder-framework-4rfyxx`
   (ou `main` une fois fusionnée).
4. Renseigne les **Build settings** :

   | Champ                    | Valeur          |
   | ------------------------ | --------------- |
   | Framework preset         | `Next.js (Static HTML Export)` |
   | Build command            | `npm run build` |
   | Build output directory   | `out`           |
   | Node version (variable)  | `NODE_VERSION = 20` |

5. Clique **Save and Deploy**. En ~1 min tu obtiens une URL
   `https://one-night.pages.dev`. ✅

> Ajoute un domaine perso plus tard via **Custom domains** dans le projet Pages.

---

## Option B — En ligne de commande (Wrangler)

Depuis ton poste, après `git clone` + `git checkout` de la branche :

```bash
npm install
npx wrangler login        # ouvre le navigateur pour s'authentifier
npm run deploy            # build + wrangler pages deploy ./out
```

La première fois, Wrangler te propose de créer le projet **one-night** — accepte.
Les déploiements suivants : un simple `npm run deploy`.

### Variante CI / token (sans navigateur)

```bash
export CLOUDFLARE_API_TOKEN="<ton_token_avec_permission_Pages>"
export CLOUDFLARE_ACCOUNT_ID="<ton_account_id>"
npm run deploy
```

---

## Scripts utiles

| Commande           | Effet                                            |
| ------------------ | ------------------------------------------------ |
| `npm run dev`      | Développement local (http://localhost:3000)      |
| `npm run build`    | Génère l'export statique dans `out/`             |
| `npm run start`    | Sert `out/` en local (via `serve`)               |
| `npm run preview`  | Build + aperçu via `wrangler pages dev`          |
| `npm run deploy`   | Build + déploiement Cloudflare Pages             |

Config Pages : voir `wrangler.toml` (`pages_build_output_dir = "out"`).
