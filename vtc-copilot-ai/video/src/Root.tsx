import { Composition } from "remotion";
import { FILM_FRAMES, Film } from "./Film";

export const FPS = 30;

export const Root = () => (
  <Composition
    id="VtcCopilotFilm"
    component={Film}
    durationInFrames={FILM_FRAMES}
    fps={FPS}
    width={1920}
    height={1080}
  />
);
