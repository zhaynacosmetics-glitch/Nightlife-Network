# Musique du film : origine et droits

La musique est **originale**. Elle est entièrement synthétisée par le script [`scripts/music.py`](scripts/music.py) (Python + NumPy) : sinusoïdes, bruit filtré, enveloppes. Aucun échantillon, aucune boucle et aucune banque de sons extérieurs ne sont utilisés.

- **Droits :** pas de licence tierce. La musique appartient au projet VTC Copilot AI, qui peut l'utiliser librement, y compris commercialement (site, réseaux sociaux, publicité).
- **Fichier :** `public/audio/musique.wav` (20 s, 44,1 kHz, stéréo), régénéré à chaque `npm run render`. Une copie est fournie à côté du film pour le mixage de la voix.
- **Niveau :** crête à environ −4 dBFS, −18 LUFS intégrés. La musique sera baissée sous la voix au mixage.

| Moment | Ambiance |
| --- | --- |
| 0 → 8 s, le problème | La mineur, pizzicati sautillants et tic-tac (comique et un peu tendu), boîte à musique sur « Am, stram, gram », trois « pschiit » et un trombone triste sur « 6 € de l'heure » |
| 8 s, le logo | Montée, impact et carillon |
| 8 → 20 s, la solution | Do majeur, pad lumineux, arpèges, batterie entraînante, pièces sur « biff », accord final |
