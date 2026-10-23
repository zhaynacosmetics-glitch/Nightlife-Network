import { Composition, Still } from "remotion";
import { FILM_FRAMES, Film } from "./Film";
import { FilmVertical } from "./FilmVertical";
import { Thumbnail } from "./Thumbnail";

export const FPS = 30;

export const Root = () => (
  <>
    <Composition id="VtcCopilotFilm" component={Film} durationInFrames={FILM_FRAMES} fps={FPS} width={1920} height={1080} />
    <Composition id="VtcCopilotFilmVertical" component={FilmVertical} durationInFrames={FILM_FRAMES} fps={FPS} width={1080} height={1920} />
    <Still id="VignetteTikTok" component={Thumbnail} width={1080} height={1920} />
  </>
);
