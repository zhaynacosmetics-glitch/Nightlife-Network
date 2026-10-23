import { Hero } from "../sections/Hero";
import { Story } from "../sections/Story";
import { Join } from "../sections/Join";

/** Trois temps : le film, le problème puis la solution, l'inscription. */
export function Home() {
  return (
    <>
      <Hero />
      <Story />
      <Join />
    </>
  );
}
