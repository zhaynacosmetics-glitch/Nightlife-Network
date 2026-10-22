# Musique du film : origine et droits

La musique est **originale**. Elle est entièrement synthétisée par le script [`scripts/music.py`](scripts/music.py) (Python + NumPy) : sinusoïdes, bruit filtré, enveloppes. Aucun échantillon, aucune boucle et aucune banque de sons extérieurs ne sont utilisés.

- **Droits :** pas de licence tierce. La musique appartient au projet VTC Copilot AI, qui peut l'utiliser librement, y compris commercialement (site, réseaux sociaux, publicité).
- **Fichier :** `public/audio/musique.wav` (27 s, 44,1 kHz, stéréo), régénéré à chaque `npm run render`, puis mixé avec la voix off ([VOIX-OFF.md](VOIX-OFF.md)).
- **Niveau :** la musique est baissée automatiquement sous la voix au mixage.

| Moment | Ambiance |
| --- | --- |
| 0 → 12,5 s, le problème | La mineur, pizzicati sautillants et tic-tac (comique et un peu tendu), boîte à musique sur « Am, stram, gram », « ka-ching » sur « PLUS », un sifflet qui se dégonfle sous chaque « Pschit », trombone triste sur « 6 euros de l'heure » |
| 12,5 s, « VTC Copilot ! » | Montée, impact et carillon |
| 12,5 → 27 s, la solution | Do majeur, pad lumineux, arpèges, batterie entraînante, pluie de pièces sur « BIFF », accord final sous la carte finale |
