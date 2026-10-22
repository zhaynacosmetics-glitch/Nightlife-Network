import { Phone } from "../../shared/Phone";
import { OfferScreen } from "../../shared/screens";
import { FilmPlayer } from "../components/FilmPlayer";
import { ButtonLink, Container, useProgress } from "../components/ui";

export function Hero() {
  const { ref, p } = useProgress({ duration: 4 });

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden pt-[calc(72px+env(safe-area-inset-top))]">
      <div aria-hidden className="pointer-events-none absolute inset-0 grid-bg [mask-image:radial-gradient(70%_60%_at_50%_20%,black,transparent)]" />
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-[720px] w-[1200px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(124,92,255,0.35),transparent)]" />

      <Container className="relative pt-12 sm:pt-20">
        <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:items-end lg:gap-14">
          <h1 id="hero-title" className="display text-[clamp(2.5rem,6.2vw,4.7rem)]">
            Chaque course compte. Voyez ce qu’elle vaut vraiment.
          </h1>
          <div className="lg:pb-3">
            <p className="max-w-[46ch] text-lg leading-relaxed text-muted sm:text-xl">
              <span translate="no">VTC Copilot AI</span> analyse chaque proposition de course (prix, approche, durée, destination et vos coûts réels) pour vous donner une estimation claire de sa rentabilité.{" "}
              <span className="text-text">La décision reste la vôtre.</span>
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="#waitlist">Rejoindre la waitlist</ButtonLink>
              <ButtonLink href="#demo" variant="ghost">
                Découvrir l’application
              </ButtonLink>
            </div>
            <p className="mt-4 text-sm text-muted">Inscription gratuite · Projet en préparation pour l’<span className="whitespace-nowrap">Île-de-France</span></p>
          </div>
        </div>

        <div className="relative mt-12 sm:mt-16 lg:mr-[150px]">
          <FilmPlayer />
          <div ref={ref} className="pointer-events-none absolute -right-[150px] -bottom-16 hidden lg:block" style={{ rotate: "4deg" }}>
            <Phone width={290} glow="#38B6FF" label="Aperçu de l’application : une nouvelle proposition de course arrive et le copilote l’analyse (données fictives)">
              <OfferScreen p={p} />
            </Phone>
          </div>
        </div>
        <details className="mt-5 max-w-3xl text-sm text-muted lg:mt-8">
          <summary className="cursor-pointer select-none rounded-md py-1 hover:text-text">Description textuelle du film</summary>
          <p id="film-description" className="mt-2 leading-relaxed">
            Des propositions de courses s’affichent en rafale : « Une course à accepter ? ». Une course à 32 € paraît intéressante, puis l’approche, la durée, le retour à vide et les coûts du véhicule ramènent son
            gain estimé à environ 6 € de l’heure : « Le bon prix ne suffit pas. ». L’interface de VTC Copilot AI rassemble ces informations et classe la course : potentiellement rentable, à analyser ou
            potentiellement peu rentable. « Votre activité. Vos coûts. Vos décisions. » Le film se termine sur le logo et l’invitation à rejoindre la waitlist. Toutes les données sont fictives.
          </p>
        </details>
      </Container>
    </section>
  );
}
