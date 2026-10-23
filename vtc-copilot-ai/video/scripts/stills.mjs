// Exporte des images fixes à des instants clés pour le contrôle qualité.
// Usage : node scripts/stills.mjs [dossier] [frame,frame,...]
import path from "node:path";
import { mkdirSync } from "node:fs";
import { renderStill } from "@remotion/renderer";
import { browserExecutable, prepare } from "./common.mjs";

const outDir = path.resolve(process.argv[2] ?? "out/stills");
const frames = (process.argv[3] ?? "20,75,100,150,215,235,265,330,385,440,500,540,599").split(",").map(Number);
mkdirSync(outDir, { recursive: true });

const { serveUrl, composition } = await prepare();
for (const frame of frames) {
  const output = path.join(outDir, `frame-${String(frame).padStart(3, "0")}.jpg`);
  await renderStill({ serveUrl, composition, frame, output, imageFormat: "jpeg", jpegQuality: 88, browserExecutable });
  console.log("✓", output);
}
