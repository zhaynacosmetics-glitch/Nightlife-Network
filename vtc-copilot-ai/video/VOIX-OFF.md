# Voix off du film

La voix off a été enregistrée par mbm sur ElevenLabs le 22 octobre 2026 : [`public/audio/voix-off-elevenlabs.mp3`](public/audio/voix-off-elevenlabs.mp3), 24,6 s. Le texte et les indications de jeu sont dans [SCENARIO.md](SCENARIO.md).

## Mixage (automatique, dans `npm run render`)

- La voix est normalisée à −16 LUFS (pic −2 dBTP).
- La musique est baissée automatiquement dès que la voix parle (compression en sidechain), puis remonte entre les phrases et sur la carte finale.
- Un limiteur évite toute saturation.

## Changer de prise

1. Remplacer `public/audio/voix-off-elevenlabs.mp3` par la nouvelle prise.
2. Mettre à jour les repères `VO` (début de chaque phrase, en secondes) dans `src/Film.tsx` et `scripts/music.py`. Ils ont été relevés sur les silences et les « ch » de la prise actuelle.
3. Si la prise dépasse 24,6 s, rallonger `FILM_FRAMES` dans `src/Film.tsx` et `DUR` dans `scripts/music.py` pour garder environ 2,4 s de carte finale.
4. Relancer `npm run render`.
