import { LogoMark } from "../../shared/Logo";
import { ButtonLink, Container } from "../components/ui";

export function FinalCta() {
  return (
    <section aria-labelledby="final-title" className="relative overflow-hidden py-28 sm:py-40">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_45%,rgba(124,92,255,0.45),transparent_70%),radial-gradient(40%_40%_at_50%_100%,rgba(56,182,255,0.25),transparent_70%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-0 grid-bg [mask-image:radial-gradient(60%_60%_at_50%_50%,black,transparent)]" />
      <Container className="relative flex flex-col items-center text-center">
        <LogoMark size={88} id="final" />
        <h2 id="final-title" className="display mt-8 max-w-4xl text-[clamp(2.4rem,6.4vw,5rem)]">
          Et si vous décidiez avec une vision plus claire&nbsp;?
        </h2>
        <p className="mt-6 max-w-[46ch] text-lg text-muted">Rejoignez les chauffeurs qui construisent VTC Copilot AI en <span className="whitespace-nowrap">Île-de-France</span>.</p>
        <ButtonLink href="#waitlist" className="mt-10 !min-h-14 !px-9 !text-[17px]">
          Rejoindre la waitlist
        </ButtonLink>
      </Container>
    </section>
  );
}
