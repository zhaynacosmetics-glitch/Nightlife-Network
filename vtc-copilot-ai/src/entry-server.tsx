import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { App } from "./App";
import { ROUTES } from "./routes";
import { FAQ } from "./content/faq";
import { site } from "./config/site";

export { ROUTES, site, FAQ };

export function render(file: string): string {
  const route = ROUTES.find((r) => r.file === file);
  if (!route) throw new Error(`Route inconnue : ${file}`);
  return renderToString(
    <StrictMode>
      <App route={route} />
    </StrictMode>,
  );
}
