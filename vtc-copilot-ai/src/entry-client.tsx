import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { App } from "./App";
import { ROUTES, routeFor } from "./routes";
import "./styles/global.css";

const root = document.getElementById("root")!;
const route = ROUTES.find((r) => r.file === root.dataset.route) ?? routeFor(window.location.pathname);

hydrateRoot(
  root,
  <StrictMode>
    <App route={route} />
  </StrictMode>,
);
