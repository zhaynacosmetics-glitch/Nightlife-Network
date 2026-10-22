// Captures de validation (pleine page) sur plusieurs tailles d'écran.
// Usage : node scripts/screenshots.mjs [baseURL] [dossier]
/* global document, window */
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const base = process.argv[2] ?? "http://localhost:8787";
const out = process.argv[3] ?? "docs/screenshots";
mkdirSync(out, { recursive: true });

const VIEWPORTS = [
  { name: "mobile-etroit-320", width: 320, height: 640, mobile: true },
  { name: "mobile-390", width: 390, height: 844, mobile: true },
  { name: "tablette-820", width: 820, height: 1180, mobile: true },
  { name: "laptop-1366", width: 1366, height: 800, mobile: false },
  { name: "grand-ecran-1920", width: 1920, height: 1080, mobile: false },
];
const only = process.env.ONLY?.split(",");

const browser = await chromium.launch();
for (const vp of VIEWPORTS.filter((v) => !only || only.includes(v.name))) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1, isMobile: vp.mobile, hasTouch: vp.mobile, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.screenshot({ path: `${out}/${vp.name}-hero.jpg`, quality: 80 });
  // Fait défiler pour déclencher les apparitions, puis capture pleine page.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${out}/${vp.name}-page.jpg`, fullPage: true, quality: 72 });
  // Sections clés
  for (const id of ["waitlist", "faq"]) {
    await page.locator(`#${id}`).screenshot({ path: `${out}/${vp.name}-section-${id}.jpg`, quality: 80 });
  }
  await page.locator("footer").screenshot({ path: `${out}/${vp.name}-footer.jpg`, quality: 80 });
  console.log("✓", vp.name);
  await ctx.close();
}

// Les quatre diapositives de la démonstration, animations jouées (desktop et mobile).
for (const vp of [VIEWPORTS[1], VIEWPORTS[3]]) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.mobile, hasTouch: vp.mobile });
  const page = await ctx.newPage();
  await page.goto(base + "/#demo", { waitUntil: "networkidle" });
  const region = page.getByRole("region", { name: "Démonstration de l’application" });
  await region.scrollIntoViewIfNeeded();
  const pause = region.getByRole("button", { name: "Mettre en pause" });
  if (await pause.count()) await pause.click();
  for (let i = 1; i <= 4; i++) {
    await region.getByRole("tab", { name: new RegExp(`Étape ${i}`) }).click();
    await page.waitForTimeout(3800);
    await region.screenshot({ path: `${out}/${vp.name}-demo-slide-${i}.jpg`, quality: 85 });
  }
  // Confirmation d'inscription (adresse de test unique)
  await page.goto(base + "/#waitlist", { waitUntil: "networkidle" });
  await page.waitForTimeout(1800);
  const form = page.locator("form[aria-labelledby=waitlist-form-title]");
  await form.getByRole("button", { name: "Rejoindre la waitlist" }).click();
  await form.screenshot({ path: `${out}/${vp.name}-waitlist-erreurs.jpg`, quality: 85 });
  await form.getByLabel("Prénom").fill("Capture");
  await form.getByLabel("Adresse e-mail").fill(`capture+${Date.now()}@exemple.fr`);
  await form.getByLabel(/J’accepte de recevoir/).check();
  await form.getByRole("button", { name: "Rejoindre la waitlist" }).click();
  await page.getByRole("status").filter({ hasText: "Merci" }).screenshot({ path: `${out}/${vp.name}-waitlist-confirmation.jpg`, quality: 85 });
  await ctx.close();
}
await browser.close();
