import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import { AnimatePresence, animate, motion, useInView, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Phone } from "../../shared/Phone";
import { AnalysisScreen, MapScreen, OfferScreen, VerdictScreen } from "../../shared/screens";
import { Container } from "../components/ui";

const SLIDES = [
  {
    title: "Une proposition arrive",
    text: "La notification s’ouvre et rassemble l’essentiel : plateforme d’origine, prix, approche, destination et durée estimée. L’analyse démarre aussitôt.",
    points: ["Prix proposé et temps de réponse restant", "Approche : distance et minutes", "Destination et durée de la course"],
    Screen: OfferScreen,
    alt: "Écran de réception : une nouvelle proposition à 34,50 € avec approche de 3,2 km, destination Aéroport d’Orly et course de 38 minutes (exemple fictif).",
  },
  {
    title: "La rentabilité, décomposée",
    text: "Le prix est confronté au temps total mobilisé et à vos coûts configurés. Vous voyez d’où vient le résultat, pas seulement le résultat.",
    points: ["Temps total et distance totale", "Coûts estimés à partir de vos réglages", "Net et taux horaire estimés"],
    Screen: AnalysisScreen,
    alt: "Écran d’analyse : coûts estimés de 6,98 €, net estimé de 27,52 € et taux horaire net estimé de 35,90 € de l’heure (exemple fictif).",
  },
  {
    title: "La destination en contexte",
    text: "Le trajet se dessine sur une carte stylisée de l’Île-de-France. Durée, distance et possibilités de retour s’affichent lorsque les données existent ; sinon, l’écran le dit.",
    points: ["Trajet et durée estimée", "Possibilités de retour, à évaluer", "Circulation : affichée seulement si une source est connectée"],
    Screen: MapScreen,
    alt: "Écran destination : trajet de Paris 10e à l’Aéroport d’Orly sur une carte stylisée, 38 minutes, retour à évaluer, circulation non connectée dans la démo.",
  },
  {
    title: "Une lecture claire, votre décision",
    text: "Vert, orange ou rouge, avec les raisons principales. Le copilote ne choisit jamais à votre place : il éclaire, vous décidez.",
    points: ["Potentiellement rentable", "À analyser", "Potentiellement peu rentable"],
    Screen: VerdictScreen,
    alt: "Écran de recommandation : course classée potentiellement rentable, avec ses raisons, deux autres propositions classées à analyser et peu rentable, et les boutons Ignorer et Accepter (exemple fictif).",
  },
];

const SLIDE_MS = 6500;

export function Demo() {
  const [index, setIndex] = useState(0);
  const [auto, setAuto] = useState(true);
  // Progression de l'écran et du minuteur, rattachées à la diapositive qu'elles concernent.
  const [prog, setProg] = useState({ i: 0, p: 0 });
  const [timer, setTimer] = useState({ i: 0, e: 0 });
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { amount: 0.4 });
  const reduced = useReducedMotion();
  const drag = useRef<{ x: number; id: number } | null>(null);
  const [phoneW, setPhoneW] = useState(320);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 420px)");
    const update = () => setPhoneW(mq.matches ? 272 : 320);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const go = useCallback((i: number) => setIndex((i + SLIDES.length) % SLIDES.length), []);

  // Animation de l'écran actif.
  useEffect(() => {
    if (reduced || !inView) return;
    const c = animate(0, 1, { duration: 3.4, ease: "linear", onUpdate: (v) => setProg({ i: index, p: v }) });
    return () => c.stop();
  }, [index, inView, reduced]);
  const p = reduced ? 1 : prog.i === index ? prog.p : 0;

  // Lecture automatique facultative (désactivée si animations réduites).
  const playing = auto && inView && !reduced;
  useEffect(() => {
    if (!playing) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const e = now - start;
      if (e >= SLIDE_MS) {
        go(index + 1);
        return;
      }
      setTimer({ i: index, e });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, index, go]);

  const elapsed = playing && timer.i === index ? timer.e : 0;

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setAuto(false);
      go(index + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setAuto(false);
      go(index - 1);
    }
  };

  const onPointerDown = (e: PointerEvent) => {
    drag.current = { x: e.clientX, id: e.pointerId };
  };
  const onPointerUp = (e: PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 50) {
      setAuto(false);
      go(index + (dx < 0 ? 1 : -1));
    }
  };

  const slide = SLIDES[index];
  const { Screen } = slide;

  return (
    <section id="demo" aria-labelledby="demo-title" className="relative overflow-hidden py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_70%_40%,rgba(56,182,255,0.16),transparent_70%),radial-gradient(50%_50%_at_20%_80%,rgba(124,92,255,0.18),transparent_70%)]" />
      <Container className="relative">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h2 id="demo-title" className="display text-[clamp(2.1rem,5vw,3.6rem)]">
              L’application, en quatre gestes.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              Démonstration visuelle du concept, avec des données fictives. Elle ne signifie pas que les connexions aux plateformes ou toutes les fonctionnalités sont déjà opérationnelles.
            </p>
          </div>
        </div>

        <div
          ref={root}
          role="region"
          aria-roledescription="carrousel"
          aria-label="Démonstration de l’application"
          tabIndex={0}
          onKeyDown={onKey}
          className="mt-12 grid items-center gap-10 rounded-[32px] outline-offset-8 lg:grid-cols-[1fr_auto] lg:gap-16"
        >
          <div className="order-2 lg:order-1">
            <div aria-live={playing ? "off" : "polite"} className="min-h-[300px] sm:min-h-[260px]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={index}
                  role="group"
                  aria-roledescription="diapositive"
                  aria-label={`${index + 1} sur ${SLIDES.length} : ${slide.title}`}
                  initial={reduced ? false : { opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduced ? { opacity: 1 } : { opacity: 0, x: -24 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p className="text-sm font-semibold text-signal tabular">
                    Étape {index + 1} sur {SLIDES.length}
                  </p>
                  <h3 className="display mt-3 text-[clamp(1.8rem,3.6vw,2.7rem)]">{slide.title}</h3>
                  <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-muted">{slide.text}</p>
                  <ul className="mt-6 space-y-2.5">
                    {slide.points.map((pt) => (
                      <li key={pt} className="flex items-center gap-3 text-[16px]">
                        <span className="size-1.5 flex-none rounded-full bg-violet-soft" aria-hidden />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button type="button" onClick={() => (setAuto(false), go(index - 1))} className="grid size-12 place-items-center rounded-full border border-white/18 hover:bg-white/8" aria-label="Diapositive précédente">
                <ChevronLeft size={20} aria-hidden />
              </button>
              <button type="button" onClick={() => (setAuto(false), go(index + 1))} className="grid size-12 place-items-center rounded-full border border-white/18 hover:bg-white/8" aria-label="Diapositive suivante">
                <ChevronRight size={20} aria-hidden />
              </button>
              {!reduced && (
                <button
                  type="button"
                  onClick={() => setAuto((a) => !a)}
                  className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/18 px-4 text-[15px] hover:bg-white/8"
                  aria-pressed={!auto}
                >
                  {auto ? <Pause size={16} aria-hidden /> : <Play size={16} aria-hidden />}
                  {auto ? "Mettre en pause" : "Lecture auto"}
                </button>
              )}
              <div className="flex w-full gap-2 sm:ml-auto sm:w-auto" role="tablist" aria-label="Choisir une diapositive">
                {SLIDES.map((s, i) => (
                  <button
                    key={s.title}
                    type="button"
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Étape ${i + 1} : ${s.title}`}
                    onClick={() => (setAuto(false), go(i))}
                    className="group relative h-11 flex-1 sm:w-16 sm:flex-none"
                  >
                    <span className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 overflow-hidden rounded-full bg-white/14 group-hover:bg-white/25">
                      <span
                        className="block h-full rounded-full bg-[linear-gradient(90deg,var(--color-violet),var(--color-signal))]"
                        style={{ width: i < index ? "100%" : i === index ? (playing ? `${(elapsed / SLIDE_MS) * 100}%` : "100%") : "0%" }}
                      />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="order-1 mx-auto touch-pan-y select-none lg:order-2" onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerCancel={() => (drag.current = null)}>
            <Phone width={phoneW} glow={index === 3 ? "#2BD99A" : "#7C5CFF"} label={slide.alt}>
              <Screen p={p} />
            </Phone>
          </div>
        </div>
      </Container>
    </section>
  );
}
