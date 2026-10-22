# Storyboard du film VTC Copilot AI

**Durée :** 20,000 s · **Format :** 16:9, 1920 × 1080, 30 images/s (600 images) · **Style :** fond blanc, police Geist, accent violet · **Son :** musique originale ([MUSIQUE.md](MUSIQUE.md)), voix off à venir ([VOIX-OFF.md](VOIX-OFF.md)) ; le film reste compréhensible son coupé · **Données :** toutes fictives, mention « Exemple illustratif · données fictives » à l’écran pendant les scènes chiffrées.

Le scénario et le script validé sont dans [SCENARIO.md](SCENARIO.md) (« Am, stram, gram ? »). Ce document donne le découpage image par image.

Sources : [`src/Film.tsx`](src/Film.tsx) (scènes), [`../shared/`](../shared) (logo, pop-up de verdict, couleurs, données de démo partagés avec le site).

| Timecode | Images | Scène | Ce qu’on voit et lit |
| --- | --- | --- | --- |
| 00:00 → 01:12 | 0 → 41 | **1. Am, stram, gram** | Six propositions tombent ; un doigt saute sur trois d’entre elles : « Am… » « Stram… » « Gram… ». |
| 01:12 → 04:02 | 42 → 121 | **2. La question** | « Vous êtes VTC / et vous voulez gagner plus d’argent ? » avec des pièces €, puis « Alors arrêtez de choisir / vos courses ~~au hasard~~. » |
| 04:02 → 08:00 | 122 → 239 | **3. Pschiit** | « Jackpot ? 32 € ? » Épingles : « 25 min pour aller chercher le client », « Retour à vide depuis Roissy 30 min », « Bouchons, station bondée, usure −20 € ». Trois « Pschiit. » de plus en plus longs, le prix se dégonfle. « Résultat : ≈ 6 €/h » puis « Un gros prix, ce n’est pas forcément une bonne course. » |
| 08:00 → 09:00 | 240 → 269 | **4. La solution** | « La solution : », le logo claque au centre (0,5 s) puis devient une icône d’app : « VTC Copilot AI · L’app des chauffeurs VTC ». |
| 09:00 → 12:20 | 270 → 379 | **5. L’IA calcule** | Douze paramètres foncent dans le téléphone, compteur jusqu’à 12, puis le pop-up « Bonne course · 57 €/h ». « Trafic, météo, demande, offre, votre voiture, vos coûts : l’IA calcule tout, en une seconde. » |
| 12:20 → 16:10 | 380 → 489 | **6. La pastille** | « Une course arrive ? Une pastille verte ou rouge s’affiche direct en dessous. » 58 € → pastille verte (part vers la droite), 14 € → pastille rouge (balayée). « Fini le pifomètre, / et vous gardez le dernier mot. » |
| 16:10 → 20:00 | 490 → 599 | **7. Biff et signature** | « Adieu les courses au pif, / bonjour les courses qui font du biff ! » avec une pluie de pièces, puis le logo se dessine, le nom et « Rejoignez-nous sur la waitlist ». |

Les €/h affichés sont calculés avec le même modèle que le site (`shared/demo.ts`, coût fictif de 0,32 €/km).

## Contrôle qualité (22 octobre 2026)

- Durée mesurée par `ffprobe` : 20,000 s, 600 images, 30/1 i/s.
- Image : 1920 × 1080, 16:9, H.264 High ; versions web en yuv420p avec `faststart`.
- Son : musique originale, AAC stéréo 44,1 kHz (192 kb/s dans le master, 128 kb/s sur le web, Opus dans les WebM), −18 LUFS, crête −4 dBFS.
- Lisibilité : images clés et planche contact (une image toutes les 2 s, `docs/screenshots/film-planche-contact.jpg`) inspectées. Corrections faites après inspection : seconde ligne de « La question » réduite (elle débordait), « 32 € ? » sur une seule ligne, épingle « bouchons » raccourcie.
- Logo plein centre de 8,00 s à 8,50 s, sous « La solution : », puis icône d’app jusqu’à 9,00 s.
- Affiche (poster) extraite à 12,4 s (« l’IA calcule tout, en une seconde » et le pop-up « Bonne course ») ; image de partage 1200 × 630 extraite à 19,9 s.
- Poids : master 7,0 Mo ; web 1080p 2,6 Mo, 720p 1,5 Mo ; repli WebM 2,6 Mo / 1,6 Mo.

## Régénérer le film

```bash
cd vtc-copilot-ai/video
npm install
npm run studio          # aperçu interactif (Remotion Studio)
npm run render          # master + versions web + affiche + image de partage
npm run stills -- out/stills 30,150,250,372,420,599   # images clés pour vérification
```
