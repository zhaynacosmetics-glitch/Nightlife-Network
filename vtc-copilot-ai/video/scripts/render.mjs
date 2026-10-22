// Rendu du film : image via la CLI Remotion, musique originale (scripts/music.py), master H.264 + AAC, puis versions web via ffmpeg.
// Usage : npm run render   (depuis vtc-copilot-ai/video)
import path from "node:path";
import { execFileSync } from "node:child_process";
import { mkdirSync, copyFileSync } from "node:fs";
import { ROOT, COMPOSITION, browserExecutable } from "./common.mjs";

const out = path.join(ROOT, "out");
const site = path.join(ROOT, "../public/media");
mkdirSync(out, { recursive: true });
mkdirSync(site, { recursive: true });
const master = path.join(out, "vtc-copilot-ai-film-master-1080p.mp4");
const picture = path.join(out, "image-seule.mp4");
const music = path.join(ROOT, "public/audio/musique.wav");
const run = (cmd, args) => execFileSync(cmd, args, { stdio: "inherit", cwd: ROOT });

const browserArgs = browserExecutable ? [`--browser-executable=${browserExecutable}`] : [];
if (!process.argv.includes("--skip-master")) {
  run("npx", ["remotion", "render", "src/index.ts", COMPOSITION, picture, "--codec=h264", "--crf=16", "--muted", ...browserArgs]);
}
// Musique (générée, sans échantillon externe) puis assemblage image + son.
run("python3", ["scripts/music.py", music]);
run("ffmpeg", ["-y", "-loglevel", "error", "-i", picture, "-i", music, "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", master]);

// Versions web : H.264 High, yuv420p, faststart (lecture progressive), musique en AAC.
const web = [
  { name: "vtc-copilot-ai-film-1080p.mp4", scale: "1920:1080", crf: "25" },
  { name: "vtc-copilot-ai-film-720p.mp4", scale: "1280:720", crf: "26" },
];
for (const v of web) {
  run("ffmpeg", [
    "-y", "-loglevel", "error", "-i", master,
    "-vf", `scale=${v.scale}:flags=lanczos`,
    "-c:v", "libx264", "-profile:v", "high", "-preset", "slow", "-crf", v.crf,
    "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-c:a", "aac", "-b:a", "128k",
    path.join(site, v.name),
  ]);
}
// Repli WebM (VP9 + Opus) pour les navigateurs sans H.264 (ex. Chromium libre).
for (const v of [
  { name: "vtc-copilot-ai-film-1080p.webm", scale: "1920:1080", crf: "36" },
  { name: "vtc-copilot-ai-film-720p.webm", scale: "1280:720", crf: "36" },
]) {
  run("ffmpeg", [
    "-y", "-loglevel", "error", "-i", master,
    "-vf", `scale=${v.scale}:flags=lanczos`,
    "-c:v", "libvpx-vp9", "-crf", v.crf, "-b:v", "0", "-row-mt", "1", "-deadline", "good", "-cpu-used", "3",
    "-pix_fmt", "yuv420p", "-c:a", "libopus", "-b:a", "96k",
    path.join(site, v.name),
  ]);
}
// Affiche (poster) : « Vous conduisez. L’IA calcule. En un instant. » et le pop-up « Bonne course » (12,4 s).
const POSTER_AT = "12.4";
run("ffmpeg", ["-y", "-loglevel", "error", "-ss", POSTER_AT, "-i", master, "-frames:v", "1", "-vf", "scale=1280:-1", "-c:v", "libwebp", "-quality", "82", path.join(site, "vtc-copilot-ai-film-poster.webp")]);
run("ffmpeg", ["-y", "-loglevel", "error", "-ss", POSTER_AT, "-i", master, "-frames:v", "1", "-vf", "scale=1280:-1", "-q:v", "4", path.join(site, "vtc-copilot-ai-film-poster.jpg")]);
// Image de partage social 1200×630 : signature finale.
run("ffmpeg", ["-y", "-loglevel", "error", "-ss", "19.9", "-i", master, "-frames:v", "1", "-vf", "scale=1200:675,crop=1200:630", "-q:v", "3", path.join(site, "og-image.jpg")]);
copyFileSync(path.join(site, "vtc-copilot-ai-film-poster.jpg"), path.join(out, "poster.jpg"));
console.log("✓ film et déclinaisons web générés");
