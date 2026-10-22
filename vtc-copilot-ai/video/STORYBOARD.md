# Storyboard du film VTC Copilot AI

**Durée :** 27,000 s · **Format :** 16:9, 1920 × 1080, 30 images/s (810 images) · **Style :** fond blanc, police Geist, accent violet · **Son :** voix off ElevenLabs + musique originale ([MUSIQUE.md](MUSIQUE.md)) ; le film reste compréhensible son coupé · **Données :** toutes fictives, mention « Exemple illustratif · données fictives » à l’écran pendant les scènes chiffrées.

Le texte de la voix off est dans [SCENARIO.md](SCENARIO.md). Les repères de la voix (en secondes) sont regroupés dans la constante `VO` de `src/Film.tsx` et de `scripts/music.py` : si une nouvelle prise est enregistrée, il suffit de les mettre à jour. Ce document donne le découpage image par image.

Sources : [`src/Film.tsx`](src/Film.tsx) (scènes), [`../shared/`](../shared) (logo, pop-up de verdict, couleurs, données de démo partagés avec le site).

| Timecode | Voix | Ce qu’on voit |
| --- | --- | --- |
| 00:00 → 01:25 | « Am, stram, gram… » | Six propositions tombent, un doigt saute sur trois d’entre elles, chaque mot jaillit au centre. |
| 01:25 → 04:02 | « Vous êtes VTC ? Vous voulez gagner PLUS ? » | Les deux questions jaillissent, des pièces € explosent sur « PLUS ». |
| 04:02 → 12:15 | « 32 euros ?! JACKPOT ?! Approche… Pschit ! Retour à vide… Pschit ! Bouchons, station, usure… Pschiiit ! Résultat : 6 euros de l’heure. » | « 32 € ?! » entouré d’étincelles, « JACKPOT ?! ». Trois épingles (Approche 25 min, Retour à vide 30 min, Bouchons, station, usure −20 €) ; à chaque « Pschit » le prix se dégonfle d’un cran, le dernier le fait s’effondrer. « Résultat : 6 € de l’heure » en rouge. |
| 12:15 → 14:05 | « VTC Copilot ! » | Le logo claque au centre avec une onde de choc, le nom apparaît, puis l’icône d’app « L’app des chauffeurs VTC ». La musique bascule du la mineur au do majeur. |
| 14:05 → 18:18 | « Trafic, météo, demande, votre voiture : l’IA calcule tout. En une seconde. » | Douze paramètres foncent dans le téléphone (les quatre cités en premier), compteur jusqu’à 12 ; « l’IA calcule tout. » puis « En une seconde. » et le pop-up « Bonne course » s’affiche. |
| 18:18 → 21:06 | « Une course ? Copilot VTC tranche. » | Deux propositions (58 € et 14 €) ; sur « tranche », une pastille verte « Bonne course » puis une rouge « Mauvaise course » s’affichent juste en dessous. Texte : « Une course ? VTC Copilot tranche. » |
| 21:06 → 24:18 | « Adieu les courses au pif… bonjour celles qui font du BIFF » | « pif » barré, puis « BIFF » grossit en vert avec une pluie de pièces. |
| 24:18 → 27:00 | *(musique seule)* | Le logo se dessine (l’aiguille balaie jusqu’au €), le nom, puis « Rejoignez la waitlist ». L’image finale reste fixe plus d’une seconde. |

Les €/h affichés sont calculés avec le même modèle que le site (`shared/demo.ts`, coût fictif de 0,32 €/km).

## Contrôle qualité (22 octobre 2026)

- Durée mesurée par `ffprobe` : 27,000 s, 810 images, 30/1 i/s (master et version sans son).
- Image : 1920 × 1080, 16:9, H.264 High ; versions web en yuv420p avec `faststart`.
- Son : voix off + musique, AAC stéréo 44,1 kHz (192 kb/s dans le master, 128 kb/s sur le web, Opus dans les WebM). Mix final −15 LUFS, crête −0,8 dBFS.
- Synchronisation : les repères `VO` ont été relevés sur la prise (silences entre les phrases, bruits « ch » des « Pschit »), puis contrôlés image par image.
- Lisibilité : images clés et planche contact (une image toutes les 2,5 s) inspectées. Corrections après inspection : « 6 € de l’heure » sur une seule ligne, « BIFF » qui grossit sans chevaucher « du ».
- Affiche (poster) extraite à 18,3 s (« l’IA calcule tout. En une seconde. » et le pop-up « Bonne course ») ; image de partage 1200 × 630 extraite à 26,9 s.
- Poids : master 7,7 Mo ; web 1080p 2,7 Mo, 720p 1,6 Mo ; repli WebM 2,5 Mo / 1,5 Mo.

## Régénérer le film

```bash
cd vtc-copilot-ai/video
npm install
npm run studio          # aperçu interactif (Remotion Studio)
npm run render          # master + versions web + affiche + image de partage
npm run stills -- out/stills 45,200,380,549,620,780   # images clés pour vérification
```
