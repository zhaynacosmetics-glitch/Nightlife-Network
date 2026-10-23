import path from "node:path";
import { existsSync } from "node:fs";
import { bundle } from "@remotion/bundler";
import { selectComposition } from "@remotion/renderer";

export const ROOT = path.resolve(import.meta.dirname, "..");
export const COMPOSITION = "VtcCopilotFilm";

// Chromium local si présent (environnement CI / conteneur), sinon Remotion télécharge le sien.
const LOCAL = [process.env.REMOTION_BROWSER, "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell"].filter(Boolean);
export const browserExecutable = LOCAL.find((p) => existsSync(p)) ?? null;

export async function prepare() {
  const serveUrl = await bundle({
    entryPoint: path.join(ROOT, "src/index.ts"),
    publicDir: path.join(ROOT, "public"),
    webpackOverride: (config) => ({
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...(config.resolve?.alias ?? {}),
          react: path.join(ROOT, "node_modules/react"),
          "react-dom": path.join(ROOT, "node_modules/react-dom"),
          "lucide-react": path.join(ROOT, "../node_modules/lucide-react"),
        },
      },
    }),
  });
  const composition = await selectComposition({ serveUrl, id: COMPOSITION, browserExecutable });
  return { serveUrl, composition };
}
