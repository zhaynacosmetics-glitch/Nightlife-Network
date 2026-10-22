import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { site } from "../config/site";

type NetInfo = { saveData?: boolean; effectiveType?: string };

type Sources = { mp4: string; webm: string };

/** Choisit la définition la plus légère adaptée à l'écran et au réseau (MP4 H.264, repli WebM VP9). */
function pickSource(): Sources {
  const conn = (navigator as Navigator & { connection?: NetInfo }).connection;
  const slow = conn?.effectiveType === "3g";
  const small = window.matchMedia("(max-width: 900px)").matches;
  const light = slow || small || (window.devicePixelRatio < 1.5 && window.innerWidth < 1400);
  return light ? { mp4: site.media.film720, webm: site.media.film720Webm } : { mp4: site.media.film1080, webm: site.media.film1080Webm };
}

/** Lecture automatique uniquement si le contexte s'y prête (pas d'économie de données, pas de réduction des animations). */
function canAutoplay(): boolean {
  const conn = (navigator as Navigator & { connection?: NetInfo }).connection;
  if (conn?.saveData) return false;
  if (conn?.effectiveType && /(^|-)2g$/.test(conn.effectiveType)) return false;
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function FilmPlayer() {
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<Sources | null>(null);
  const [playing, setPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [failed, setFailed] = useState(false);
  const [muted, setMuted] = useState(true);

  // Charge et lance la vidéo seulement lorsqu'elle est visible.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const auto = canAutoplay();
    const io = new IntersectionObserver(
      ([entry]) => {
        const v = video.current;
        if (entry.isIntersecting) {
          if (auto && !userPaused) {
            setSrc((s) => s ?? pickSource());
            if (v && v.currentSrc) v.play().catch(() => setPlaying(false));
          }
        } else if (v && !v.paused) {
          v.pause();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [userPaused]);

  useEffect(() => {
    const v = video.current;
    if (!v || !src) return;
    v.load();
    v.play().catch(() => setPlaying(false));
  }, [src]);

  const toggle = useCallback(() => {
    const v = video.current;
    if (!v) return;
    if (!src) {
      setUserPaused(false);
      setSrc(pickSource());
      return;
    }
    if (v.paused) {
      setUserPaused(false);
      v.play().catch(() => setFailed(true));
    } else {
      setUserPaused(true);
      v.pause();
    }
  }, [src]);

  // Le film démarre toujours sans son ; la musique ne joue que si le visiteur l'active.
  const toggleSound = useCallback(() => {
    const v = video.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }, []);

  return (
    <div ref={wrap} className="group relative aspect-video w-full overflow-hidden rounded-[20px] bg-mist ring-1 ring-line shadow-[0_60px_120px_-50px_rgba(11,13,18,0.45),0_30px_80px_-40px_rgba(110,75,255,0.35)] sm:rounded-[28px]">
      <video
        ref={video}
        className="absolute inset-0 size-full object-cover"
        poster={site.media.poster}
        muted
        playsInline
        loop
        preload="none"
        width={1280}
        height={720}
        aria-label="Film de présentation de VTC Copilot AI, 20 secondes, son coupé par défaut"
        aria-describedby="film-description"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        data-testid="film"
      >
        {src && (
          <>
            <source src={src.mp4} type="video/mp4" />
            <source src={src.webm} type="video/webm" onError={() => setFailed(true)} />
          </>
        )}
      </video>
      {!playing && (
        <button
          type="button"
          onClick={toggle}
          className="absolute inset-0 grid place-items-center bg-white/10 transition-colors hover:bg-white/0"
        >
          <span className="flex items-center gap-3 rounded-full bg-ink py-3 pl-3 pr-6 text-[15px] font-medium text-white shadow-[0_20px_40px_-12px_rgba(11,13,18,0.6)] transition-transform group-hover:scale-105 motion-reduce:transition-none">
            <span className="grid size-9 place-items-center rounded-full bg-white text-ink">
              <Play size={17} fill="currentColor" aria-hidden />
            </span>
            Voir le film · 20 s<span className="sr-only"> (son coupé par défaut)</span>
          </span>
        </button>
      )}
      {playing && (
        <button
          type="button"
          onClick={toggleSound}
          className="absolute bottom-3 left-3 flex h-11 items-center gap-2 rounded-full bg-ink/75 px-4 text-[14px] font-medium text-white ring-1 ring-white/20 backdrop-blur"
          aria-pressed={!muted}
        >
          {muted ? <VolumeX size={18} aria-hidden /> : <Volume2 size={18} aria-hidden />}
          {muted ? "Activer le son" : "Couper le son"}
        </button>
      )}
      {playing && (
        <button
          type="button"
          onClick={toggle}
          className="absolute bottom-3 right-3 grid size-11 place-items-center rounded-full bg-ink/75 text-white ring-1 ring-white/20 backdrop-blur transition-opacity sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100"
          aria-label="Mettre le film en pause"
        >
          <Pause size={18} fill="currentColor" aria-hidden />
        </button>
      )}
      {failed && (
        <p className="absolute inset-x-3 bottom-3 rounded-xl bg-white/95 px-4 py-3 text-sm text-ink shadow" role="status">
          La vidéo n’a pas pu être lue. <a className="underline" href={site.media.film720}>Ouvrir le fichier MP4</a>.
        </p>
      )}
    </div>
  );
}
