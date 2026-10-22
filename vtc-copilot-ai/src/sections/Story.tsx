import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, animate, motion, useInView, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { Bell, Car, Clock3, CloudRain, Fuel, MapPin, Moon, Navigation, Plane, SlidersHorizontal, TrafficCone, TrendingDown, Undo2, Wallet } from "lucide-react";
import { Chip, NotifCard, VerdictPill } from "../components/Bubbles";
import { Container, Pop } from "../components/ui";
import { Phone } from "../../shared/Phone";
import { AnalysisScreen, MapScreen, OfferScreen } from "../../shared/screens";
import { CoachScreen, ContextScreen, NotifsScreen, OverlayScreen } from "../../shared/coach";
import { fmtEUR } from "../../shared/brand";
import { DRIVER, RIDE_MAIN, RIDE_MID, RIDE_TRAP, estimate } from "../../shared/demo";

const MAIN = estimate(RIDE_MAIN);
const TRAP = estimate(RIDE_TRAP);

interface Step {
  kicker: "Le problème" | "La solution";
  title: string;
  sub: string;
  label: string;
  Screen: (props: { p: number }) => ReactNode;
  /** Pop-ups : position (classes) + contenu. */
  pops: { at: string; rotate: number; node: ReactNode }[];
  /** Écran plus riche : animation plus longue. */
  long?: boolean;
}

const STEPS: Step[] = [
  {
    kicker: "Le problème",
    title: "Un prix s’affiche.",
    sub: "Quelques secondes pour décider.",
    label: "Proposition de course",
    Screen: ({ p }) => <OfferScreen p={p} ride={RIDE_TRAP} />,
    pops: [
      { at: "-left-36 top-[8%]", rotate: -6, node: <NotifCard price={fmtEUR(RIDE_MID.price)} route={`${RIDE_MID.from} → ${RIDE_MID.to}`} /> },
      { at: "-right-40 top-[30%]", rotate: 5, node: <NotifCard price="41,00 €" route="Paris 15e → La Défense (92)" /> },
      { at: "-left-28 bottom-[14%]", rotate: 3, node: <NotifCard price={fmtEUR(RIDE_MAIN.price)} route={`${RIDE_MAIN.from} → Orly (94)`} /> },
    ],
  },
  {
    kicker: "Le problème",
    title: "Mais que reste-t-il ?",
    sub: "Approche, retour à vide, coûts du véhicule : rien n’est affiché.",
    label: "Trajet et destination",
    Screen: MapScreen,
    pops: [
      { at: "-left-40 top-[10%]", rotate: -4, node: <Chip tone="violet" icon={<Navigation size={16} aria-hidden />} label="Approche" value={`${RIDE_TRAP.approachMin} min`} /> },
      { at: "-right-44 top-[22%]", rotate: 4, node: <Chip tone="maybe" icon={<Undo2 size={16} aria-hidden />} label="Retour à vide" value={`${RIDE_TRAP.returnMin} min`} /> },
      { at: "-left-48 top-[48%]", rotate: 3, node: <Chip tone="maybe" icon={<Fuel size={16} aria-hidden />} label="Coûts du véhicule" value={`− ${fmtEUR(TRAP.costs)}`} /> },
      { at: "-right-36 bottom-[18%]", rotate: -5, node: <Chip tone="stop" icon={<TrendingDown size={16} aria-hidden />} label="Net estimé" value={`≈ ${fmtEUR(TRAP.hourly, 0)}/h`} /> },
    ],
  },
  {
    kicker: "La solution",
    title: "Parlez à votre coach.",
    sub: "Votre véhicule, votre secteur, vos horaires : il apprend votre façon de rouler.",
    label: "Profil avec le coach IA",
    Screen: CoachScreen,
    pops: [
      { at: "-left-36 top-[10%]", rotate: -5, node: <Chip icon={<Car size={16} aria-hidden />} label="Véhicule" value={DRIVER.vehicle} /> },
      { at: "-right-40 top-[24%]", rotate: 4, node: <Chip icon={<MapPin size={16} aria-hidden />} label="Base" value={DRIVER.base} /> },
      { at: "-left-44 top-[52%]", rotate: 3, node: <Chip icon={<Moon size={16} aria-hidden />} label="Horaires" value="Nuit" /> },
      { at: "-right-36 bottom-[16%]", rotate: -3, node: <Chip icon={<Plane size={16} aria-hidden />} label="Priorité" value="Aéroports" /> },
    ],
  },
  {
    kicker: "La solution",
    title: "Il lit le terrain.",
    sub: "Trafic, météo, vols, événements : le contexte de chaque course.",
    label: "Contexte : trafic, météo, vols",
    Screen: ContextScreen,
    pops: [
      { at: "-left-40 top-[12%]", rotate: -4, node: <Chip tone="stop" icon={<TrafficCone size={16} aria-hidden />} label="Paris 12e" value="dense" /> },
      { at: "-right-40 top-[20%]", rotate: 4, node: <Chip tone="go" icon={<TrafficCone size={16} aria-hidden />} label="Paris 16e" value="fluide" /> },
      { at: "-left-44 top-[50%]", rotate: 2, node: <Chip tone="violet" icon={<CloudRain size={16} aria-hidden />} label="Pluie" value="22 h" /> },
      { at: "-right-48 bottom-[18%]", rotate: -4, node: <Chip tone="maybe" icon={<Plane size={16} aria-hidden />} label="CDG" value="3 vols annulés" /> },
    ],
  },
  {
    kicker: "La solution",
    title: "Chaque course a sa note.",
    sub: "Un pop-up s’affiche au-dessus de la proposition : bonne, moyenne ou mauvaise.",
    label: "Pop-up de verdict sur une proposition",
    Screen: OverlayScreen,
    long: true,
    pops: [
      { at: "-left-36 top-[14%]", rotate: -5, node: <VerdictPill verdict="green" /> },
      { at: "-right-36 top-[36%]", rotate: 4, node: <VerdictPill verdict="orange" /> },
      { at: "-left-40 bottom-[24%]", rotate: 3, node: <VerdictPill verdict="red" /> },
    ],
  },
  {
    kicker: "La solution",
    title: "Analyse éclair.",
    sub: "Votre profil et les données de l’offre, réunis en un chiffre.",
    label: "Analyse de rentabilité",
    Screen: AnalysisScreen,
    pops: [
      { at: "-left-32 top-[9%]", rotate: -3, node: <Chip icon={<Wallet size={16} aria-hidden />} label="Prix" value={fmtEUR(RIDE_MAIN.price)} /> },
      { at: "-right-36 top-[16%]", rotate: 3, node: <Chip icon={<Clock3 size={16} aria-hidden />} label="Durée" value={`${MAIN.totalMin} min`} /> },
      { at: "-left-44 top-[44%]", rotate: 2, node: <Chip icon={<SlidersHorizontal size={16} aria-hidden />} label="Vos coûts" value="0,32 €/km" /> },
      { at: "-right-44 top-[56%]", rotate: -3, node: <VerdictPill verdict="green" value={`${fmtEUR(MAIN.hourly)}/h`} /> },
    ],
  },
  {
    kicker: "La solution",
    title: "Il vous guide.",
    sub: "Le bon conseil au bon moment, pour être au bon endroit.",
    label: "Notifications du coach",
    Screen: NotifsScreen,
    long: true,
    pops: [
      { at: "-left-40 top-[14%]", rotate: -4, node: <Chip tone="violet" icon={<Bell size={16} aria-hidden />} label="Conseil" value="Paris 16e" /> },
      { at: "-right-44 bottom-[26%]", rotate: 4, node: <Chip tone="stop" icon={<Plane size={16} aria-hidden />} label="CDG" value="vols annulés" /> },
    ],
  },
];

const MOBILE_AT = ["-left-[84px] top-[16%]", "-right-[84px] top-[58%]"];

/** Largeur du téléphone selon la hauteur d'écran disponible. */
function usePhoneWidth() {
  const [w, setW] = useState(300);
  useEffect(() => {
    const update = () => {
      const h = window.innerHeight;
      const mobile = window.innerWidth < 1024;
      const fromHeight = (h - (mobile ? 320 : 150)) / 2.06;
      setW(Math.round(Math.max(190, Math.min(mobile ? 280 : 330, fromHeight))));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return w;
}

/** Phase 2 : le problème puis la solution, racontés au défilement. */
export function Story() {
  const section = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [p, setP] = useState(1);
  const visible = useInView(section, { amount: 0.05 });
  const phoneW = usePhoneWidth();
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(STEPS.length - 1, Math.max(0, Math.floor(v * STEPS.length)));
    setStep((s) => (s === next ? s : next));
  });

  // Rejoue l'animation de l'écran à chaque étape.
  useEffect(() => {
    if (reduced || !visible) return;
    const c = animate(0, 1, { duration: STEPS[step].long ? 6.5 : 2.4, ease: "linear", onUpdate: setP });
    return () => c.stop();
  }, [step, reduced, visible]);

  const goTo = (i: number) => {
    const el = section.current;
    if (!el) return;
    const span = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY + span * ((i + 0.5) / STEPS.length);
    window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
  };

  const s = STEPS[step];
  const solution = s.kicker === "La solution";

  return (
    <section id="solution" ref={section} aria-labelledby="story-title" className="relative" style={{ height: `${STEPS.length * 75 + 25}vh` }}>
      <h2 id="story-title" className="sr-only">
        Le problème, puis la solution
      </h2>
      <ol className="sr-only">
        {STEPS.map((x) => (
          <li key={x.title}>
            {x.kicker} : {x.title} {x.sub}
          </li>
        ))}
      </ol>

      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <motion.div aria-hidden className="pointer-events-none absolute inset-0" animate={{ background: solution ? "radial-gradient(60% 55% at 70% 55%, rgba(110,75,255,0.10), transparent 70%)" : "radial-gradient(60% 55% at 70% 55%, rgba(229,54,75,0.07), transparent 70%)" }} transition={{ duration: 0.8 }} />
        <Container className="relative grid h-full grid-rows-[auto_1fr] items-center gap-4 pt-[76px] lg:grid-cols-[1fr_1fr] lg:grid-rows-1 lg:gap-10 lg:pt-0">
          {/* Texte : une phrase à la fois */}
          <div aria-hidden className="relative text-center lg:text-left">
            <div className="flex items-center justify-center gap-2 lg:justify-start">
              <span className={`size-2 rounded-full transition-colors duration-500 ${solution ? "bg-violet" : "bg-stop"}`} />
              <span className="text-[13px] font-medium uppercase tracking-[0.08em] text-muted">{s.kicker}</span>
            </div>
            <div className="relative mt-3 min-h-[2.1em] text-[clamp(2.1rem,5.4vw,4.6rem)] lg:min-h-[2.2em]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={s.title}
                  className="display"
                  initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -24, filter: "blur(8px)" }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  {s.title}
                </motion.p>
              </AnimatePresence>
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.p key={s.sub} className="mx-auto mt-2 max-w-[32ch] text-[clamp(1rem,1.6vw,1.2rem)] text-muted lg:mx-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                {s.sub}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Smartphone + pop-ups */}
          <div className="relative flex h-full items-start justify-center pb-10 lg:items-center lg:pb-0">
            <div className="relative" style={{ width: phoneW }}>
              <Phone width={phoneW} label={`Démonstration, écran ${step + 1} sur ${STEPS.length} : ${s.label} (données fictives)`}>
                <AnimatePresence initial={false}>
                  <motion.div key={step} className="absolute inset-0" initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
                    <s.Screen p={reduced ? 1 : p} />
                  </motion.div>
                </AnimatePresence>
              </Phone>
              {/* Mobile : deux pop-ups qui débordent légèrement de l'écran */}
              <div aria-hidden className="pointer-events-none absolute inset-0 sm:hidden">
                {s.pops.slice(-2).map((pop, j) => (
                  <Pop key={`m-${step}-${j}`} show delay={0.35 + j * 0.3} rotate={pop.rotate} float className={`absolute ${MOBILE_AT[j]}`}>
                    <div className="origin-center scale-[0.68]">{pop.node}</div>
                  </Pop>
                ))}
              </div>
              <div aria-hidden className="pointer-events-none absolute inset-0 hidden sm:block">
                {s.pops.map((pop, j) => (
                  <Pop key={`${step}-${j}`} show delay={0.25 + j * 0.22} rotate={pop.rotate} float className={`absolute ${pop.at}`}>
                    {pop.node}
                  </Pop>
                ))}
              </div>
            </div>

            {/* Étapes */}
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-2 lg:bottom-auto lg:left-auto lg:right-0 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-0 lg:flex-col">
              {STEPS.map((x, i) => (
                <button
                  key={x.title}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Étape ${i + 1} : ${x.title}`}
                  aria-current={i === step ? "step" : undefined}
                  className="grid size-6 place-items-center rounded-full"
                >
                  <span className={`block rounded-full transition-all duration-300 ${i === step ? "size-2.5 bg-ink" : "size-2 bg-ink/20"}`} />
                </button>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
