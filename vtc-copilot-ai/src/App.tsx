import { Footer } from "./components/Footer";
import { Nav } from "./components/Nav";
import type { Route } from "./routes";

export function App({ route }: { route: Route }) {
  const { Page } = route;
  return (
    <>
      <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-5 focus:py-3 focus:font-semibold focus:text-ink">
        Aller au contenu
      </a>
      <Nav />
      <main id="contenu">
        <Page />
      </main>
      <Footer />
    </>
  );
}
