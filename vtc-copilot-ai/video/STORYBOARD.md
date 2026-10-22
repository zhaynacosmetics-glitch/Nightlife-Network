# Storyboard du film VTC Copilot AI

**Durée :** 20,000 s · **Format :** 16:9, 1920 × 1080, 30 images/s (600 images) · **Son :** aucun (version muette, compréhensible sans voix off) · **Données :** toutes fictives, mention « Exemple illustratif · données fictives » à l’écran pendant les scènes chiffrées.

Sources : [`src/Film.tsx`](src/Film.tsx) (scènes), [`../shared/`](../shared) (écrans de l’application, logo, couleurs, données de démo partagés avec le site).

| Timecode | Images | Scène | Ce qu’on voit | Texte à l’écran |
| --- | --- | --- | --- | --- |
| 00:00 → 04:00 | 0 → 119 | **Le problème** | Huit notifications de courses surgissent en rafale aux quatre coins de l’écran (rebond, légère rotation, prix qui clignotent, minuteurs qui se vident). L’image tremble légèrement. À 2 s, les cartes se floutent derrière le titre ; à 3,5 s elles s’envolent vers l’extérieur. | « Une course à accepter ? » puis « Quelques secondes pour décider. » |
| 04:00 → 08:00 | 120 → 239 | **Le doute** | Une course à 32 € entre au centre : « Elle a l’air intéressante… ». Quatre facteurs glissent à droite : approche 16 km · 28 min, course 52 min · 28 km, retour à vide estimé 30 min, coûts du véhicule − 20,48 €. Le prix est barré en rouge, le compteur descend jusqu’à « ≈ 6 €/h » net estimé. Fond qui vire au rouge. | « Ce qu’elle rapporte vraiment : » · « Le bon prix ne suffit pas. » |
| 08:00 → 13:00 | 240 → 389 | **La solution** | Un balayage de lumière violet-bleu ouvre la scène. Six pastilles (Prix, Approche, Durée, Coûts, Destination, Préférences) convergent vers un moteur d’analyse en anneaux rotatifs, puis le smartphone apparaît : l’écran d’analyse décompose le prix (coûts / net), les chiffres s’animent jusqu’à 35,90 €/h. Les trois états apparaissent. | « Analysez. » « Comparez. » « Décidez. » · « Potentiellement rentable » (vert) · « À analyser » (orange) · « Potentiellement peu rentable » (rouge) |
| 13:00 → 17:00 | 390 → 509 | **La décision** | Ambiance apaisée, teinte verte. Le smartphone affiche la recommandation : jauge, « Potentiellement rentable », raisons, deux autres propositions classées, boutons Ignorer / Accepter. Un toucher sur « Accepter » montre que le chauffeur décide. | « Votre activité. » « Vos coûts. » « Vos décisions. » · « Le copilote éclaire. Vous décidez. » |
| 17:00 → 20:00 | 510 → 599 | **Signature** | Flash, trait de route lumineux qui traverse l’écran, le logo (jauge + aiguille de navigation) se dessine, le nom apparaît lettre par lettre, puis la signature et le bouton. L’image finale reste fixe plus d’une seconde. | « VTC COPILOT AI » · « Roulez plus intelligemment. » · « Rejoignez la waitlist » |

## Contrôle qualité (22 octobre 2026)

- Durée mesurée par `ffprobe` : 20,000 s, 600 images, 30/1 i/s.
- Résolution et ratio : 1920 × 1080, 16:9, H.264 High, yuv420p, `faststart`.
- Lisibilité : planches contact à 2 i/s et images clés inspectées (voir `docs/screenshots/film-*.jpg`). Corrections faites après inspection : titres de la scène « Décision » réduits (débordaient à droite), smartphone agrandi en scène « Solution », signature accélérée pour tenir l’image finale plus longtemps, insécable avant « ? ».
- Affiche (poster) extraite à 12,4 s (scène « Solution », trois états visibles) ; image de partage 1200 × 630 extraite à 19,9 s.
- Poids : master 9,8 Mo (CRF 16) ; web 1080p 2,5 Mo, 720p 1,0 Mo ; repli WebM 1,7 Mo / 0,9 Mo.

## Régénérer le film

```bash
cd vtc-copilot-ai/video
npm install
npm run studio          # aperçu interactif (Remotion Studio)
npm run render          # master + versions web + affiche + image de partage
npm run stills -- out/stills 30,150,300,450,580   # images clés pour vérification
```
