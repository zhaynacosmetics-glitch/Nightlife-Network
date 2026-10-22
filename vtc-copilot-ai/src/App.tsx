import { MotionConfig } from "motion/react";
import { Dialogs } from "./components/Dialogs";
import { Footer } from "./components/Footer";
import { Nav } from "./components/Nav";
import type { Route } from "./routes";

export function App({ route }: { route: Route }) {
  const { Page } = route;
  return (
    <MotionConfig reducedMotion="user">
      <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:font-medium focus:text-white">
        Aller au contenu
      </a>
      <Nav />
      <main id="contenu">
        <Page />
      </main>
      <Footer />
      <Dialogs />
    </MotionConfig>
  );
}
