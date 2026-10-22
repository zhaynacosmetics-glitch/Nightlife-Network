import { Composition } from "remotion";
import { Film } from "./Film";

export const FPS = 30;
export const DURATION_S = 20;

export const Root = () => (
  <Composition
    id="VtcCopilotFilm"
    component={Film}
    durationInFrames={DURATION_S * FPS}
    fps={FPS}
    width={1920}
    height={1080}
  />
);
