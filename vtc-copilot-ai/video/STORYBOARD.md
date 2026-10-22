# Storyboard du film VTC Copilot AI

**Durée :** 20,000 s · **Format :** 16:9, 1920 × 1080, 30 images/s (600 images) · **Style :** fond blanc, police Geist, accent violet · **Son :** aucun (version muette, compréhensible sans voix off) · **Données :** toutes fictives, mention « Exemple illustratif · données fictives » à l’écran pendant les scènes chiffrées.

Le scénario et ses intentions sont dans [SCENARIO.md](SCENARIO.md) (« Am, stram, gram ? »). Ce document donne le découpage image par image.

Sources : [`src/Film.tsx`](src/Film.tsx) (scènes), [`../shared/`](../shared) (logo, pop-up de verdict, couleurs, données de démo partagés avec le site).

| Timecode | Images | Scène | Ce qu’on voit | Texte à l’écran |
| --- | --- | --- | --- | --- |
| 00:00 → 03:10 | 0 → 99 | **1. La comptine** | Six propositions de course tombent du haut et rebondissent. Un doigt (point violet) saute de l’une à l’autre en arc, au rythme de la comptine. Puis les cartes se floutent. | « Am. » « Stram. » « Gram. » · « Vous choisissez au hasard ? » |
| 03:10 → 08:00 | 100 → 239 | **2. Le ballon** | Une course à 32 € jaillit, entourée d’étincelles. Trois épingles la piquent : approche 28 min, retour à vide 30 min, carburant et usure − 20,48 €. Le prix tremble, se dégonfle, et devient « ≈ 6 €/h » en rouge. | « Jackpot ? » · « Pschiiit. » · « Ce qui brille ne paie pas toujours. » |
| 08:00 → 09:00 | 240 → 269 | **3. Le logo** | Flash. Le logo claque très grand au milieu de l’écran (environ 0,5 s), avec une onde de choc. Il se range dans une icône d’app. La jauge se termine par €. | « VTC Copilot AI » · « L’app des chauffeurs VTC » |
| 09:00 → 13:00 | 270 → 389 | **4. L’IA calcule** | Un smartphone. Douze paramètres foncent vers lui : trafic, météo, demande, offre de chauffeurs, votre voiture, approche, retour à vide, péages, horaires, événements, vos coûts, vos préférences. Un compteur grimpe jusqu’à 12. Puis une demande de course à 58 € arrive et le pop-up « Bonne course · 57 €/h » saute au-dessus. | « Vous conduisez. » « L’IA calcule. » « En un instant. » |
| 13:00 → 17:00 | 390 → 509 | **5. Le tri** | Trois propositions arrivent l’une après l’autre et reçoivent un tampon : « Bonne course · 57 €/h » (la carte file vers « Accepter »), « Mauvaise course · 11 €/h » (balayée), « Course moyenne · 17 €/h » (elle reste : « À vous de voir. »). | « Chaque course a sa note. » · « Vous gardez le dernier mot. » |
| 17:00 → 20:00 | 510 → 599 | **6. Signature** | Le logo se dessine, l’aiguille balaie jusqu’au €, qui s’allume d’une étincelle verte. Le nom apparaît lettre par lettre, puis la signature et le bouton. L’image finale reste fixe plus d’une seconde. | « VTC Copilot AI » · « Chaque course compte. » · « Rejoignez la waitlist » |

Les €/h affichés sont calculés avec le même modèle que le site (`shared/demo.ts`, coût fictif de 0,32 €/km).

## Contrôle qualité (22 octobre 2026)

- Durée mesurée par `ffprobe` : 20,000 s, 600 images, 30/1 i/s.
- Résolution et ratio : 1920 × 1080, 16:9, H.264 High ; versions web en yuv420p avec `faststart`, sans piste audio.
- Lisibilité : images clés et planche contact (une image toutes les 2 s, `docs/screenshots/film-planche-contact.jpg`) inspectées. Corrections faites après inspection : tampons du « tri » remontés (ils masquaient la destination), cartes agrandies, €/h du tri recalculés avec le modèle de démonstration (11 et 17 €/h).
- Logo plein centre de 8,00 s à 8,50 s, puis icône d’app jusqu’à 9,00 s.
- Affiche (poster) extraite à 12,4 s (« L’IA calcule. » et le pop-up « Bonne course ») ; image de partage 1200 × 630 extraite à 19,9 s.
- Poids : master 6,3 Mo (CRF 16) ; web 1080p 2,0 Mo, 720p 1,0 Mo ; repli WebM 2,1 Mo / 1,2 Mo.

## Régénérer le film

```bash
cd vtc-copilot-ai/video
npm install
npm run studio          # aperçu interactif (Remotion Studio)
npm run render          # master + versions web + affiche + image de partage
npm run stills -- out/stills 30,150,250,372,420,599   # images clés pour vérification
```
