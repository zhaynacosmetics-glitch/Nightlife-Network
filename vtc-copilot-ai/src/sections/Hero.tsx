import { Navigation, TrendingDown, Undo2 } from "lucide-react";
import { Chip, NotifCard, VerdictPill } from "../components/Bubbles";
import { FilmPlayer } from "../components/FilmPlayer";
import { ButtonLink, Container, Pop } from "../components/ui";
import { fmtEUR } from "../../shared/brand";
import { RIDE_MAIN, RIDE_TRAP, estimate } from "../../shared/demo";

const MAIN = estimate(RIDE_MAIN);
const TRAP = estimate(RIDE_TRAP);

const WORDS = ["Chaque", "course", "compte."];

/** Phase 1 : le film, entouré de notifications qui surgissent. */
export function Hero() {
  const word = (i: number) => ({ className: "animate-rise", style: { animationDelay: `${0.1 + i * 0.09}s` } });

  return (
    <section id="film" aria-labelledby="hero-title" className="relative overflow-x-clip pb-16 pt-[calc(64px+2.75rem+env(safe-area-inset-top))] sm:pb-24 sm:pt-[calc(64px+4.5rem)]">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[620px] bg-[radial-gradient(50%_60%_at_50%_0%,rgba(110,75,255,0.10),transparent_75%)]" />
      <Container className="relative text-center">
        <span className="animate-pop-in inline-block">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 text-[13px] font-medium text-muted">
            <span className="size-1.5 rounded-full bg-go" /> Bientôt en <span className="whitespace-nowrap">Île-de-France</span>
          </span>
        </span>
        <h1 id="hero-title" className="display mx-auto mt-6 text-[clamp(3rem,9vw,6.6rem)]">
          {WORDS.map((w, i) => (
            <span key={w} className={`inline-block ${word(i).className}`} style={word(i).style}>
              {w}
              {i < WORDS.length - 1 && " "}
            </span>
          ))}
        </h1>
        <p className="mx-auto mt-5 max-w-[30ch] text-[clamp(1.1rem,2.2vw,1.4rem)] leading-snug text-muted animate-rise" style={word(3).style}>
          Voyez ce qu’une course rapporte vraiment, avant de l’accepter.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row animate-rise" style={word(4).style}>
          <ButtonLink href="#waitlist">Rejoindre la waitlist</ButtonLink>
          <ButtonLink href="#solution" variant="ghost">
            Découvrir l’application
          </ButtonLink>
        </div>
      </Container>

      <Container className="relative mt-14 max-w-[1080px] sm:mt-20">
        <div className="animate-film-in">
          <FilmPlayer />
        </div>

        {/* Pop-ups autour du film (exemples fictifs) */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <Pop delay={1.1} rotate={-4} float className="absolute -left-2 -top-10 sm:-left-10 lg:-left-20">
            <NotifCard price={fmtEUR(RIDE_TRAP.price)} route={`${RIDE_TRAP.from} → ${RIDE_TRAP.to}`} />
          </Pop>
          <Pop delay={1.6} rotate={3} float className="absolute -right-2 top-[14%] hidden sm:block lg:-right-16">
            <Chip tone="stop" icon={<TrendingDown size={16} aria-hidden />} label="Net estimé" value={`≈ ${fmtEUR(TRAP.hourly, 0)}/h`} />
          </Pop>
          <Pop delay={2.0} rotate={-2} float className="absolute -left-14 bottom-[22%] hidden lg:block">
            <Chip tone="maybe" icon={<Undo2 size={16} aria-hidden />} label="Retour à vide" value={`${RIDE_TRAP.returnMin} min`} />
          </Pop>
          <Pop delay={2.3} rotate={-3} float className="absolute -left-8 bottom-[48%] hidden xl:block">
            <Chip tone="violet" icon={<Navigation size={16} aria-hidden />} label="Approche" value={`${RIDE_TRAP.approachMin} min`} />
          </Pop>
          <Pop delay={2.7} rotate={2} float className="absolute -bottom-7 -right-1 sm:-right-8 lg:-right-14">
            <VerdictPill verdict="green" value={`${fmtEUR(MAIN.hourly)}/h`} />
          </Pop>
        </div>
      </Container>
      <p className="mt-12 text-center text-[13px] text-muted">Film de 20 s, sans son · Exemples illustratifs, données fictives</p>
      <p id="film-description" className="sr-only">
        Le film montre un chauffeur qui choisit ses courses au hasard, comme dans la comptine « Am, stram, gram ». Une course à 32 € semble un jackpot, mais une fois l’approche, le retour à vide
        et les coûts comptés, elle ne rapporte qu’environ 6 € de l’heure. Le logo VTC Copilot AI apparaît alors : c’est une app. Son IA calcule en un instant, à partir de douze paramètres (trafic,
        météo, demande, offre de chauffeurs, voiture, coûts…), si une course est rentable, et affiche « Bonne course », « Course moyenne » ou « Mauvaise course ». Le chauffeur garde le dernier mot.
        Le film se termine sur « Chaque course compte » et l’invitation à rejoindre la waitlist. Données fictives.
      </p>
    </section>
  );
}
