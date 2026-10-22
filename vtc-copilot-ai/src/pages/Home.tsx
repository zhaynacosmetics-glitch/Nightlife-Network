import { Hero } from "../sections/Hero";
import { Problem } from "../sections/Problem";
import { Solution } from "../sections/Solution";
import { Demo } from "../sections/Demo";
import { Benefits } from "../sections/Benefits";
import { Waitlist } from "../sections/Waitlist";
import { CoBuild } from "../sections/CoBuild";
import { Partners } from "../sections/Partners";
import { Faq } from "../sections/Faq";
import { FinalCta } from "../sections/FinalCta";

export function Home() {
  return (
    <>
      <Hero />
      <Problem />
      <Solution />
      <Demo />
      <Benefits />
      <Waitlist />
      <CoBuild />
      <Partners />
      <Faq />
      <FinalCta />
    </>
  );
}
