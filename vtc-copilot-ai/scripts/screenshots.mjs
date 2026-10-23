// Captures de validation sur plusieurs tailles d'écran (animations jouées).
// Usage : node scripts/screenshots.mjs [baseURL] [dossier]
/* global document, window */
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const base = process.argv[2] ?? "http://localhost:8787";
const out = process.argv[3] ?? "docs/screenshots";
mkdirSync(out, { recursive: true });

const VIEWPORTS = [
  { name: "mobile-etroit-320", width: 320, height: 640, mobile: true, steps: [4] },
  { name: "mobile-390", width: 390, height: 844, mobile: true, steps: [0, 1, 2, 3, 4, 5, 6] },
  { name: "tablette-820", width: 820, height: 1180, mobile: true, steps: [4] },
  { name: "laptop-1366", width: 1366, height: 800, mobile: false, steps: [0, 1, 2, 3, 4, 5, 6] },
  { name: "grand-ecran-1920", width: 1920, height: 1080, mobile: false, steps: [4] },
];
const LONG = new Set([4, 6]); // écrans à animation longue
const only = process.env.ONLY?.split(",");

const browser = await chromium.launch();
for (const vp of VIEWPORTS.filter((v) => !only || only.includes(v.name))) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1, isMobile: vp.mobile, hasTouch: vp.mobile });
  const page = await ctx.newPage();
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(3500);
  await page.screenshot({ path: `${out}/${vp.name}-1-film.jpg`, quality: 80 });

  // Phase 2 : chaque écran du récit, au milieu de son étape de défilement.
  const sec = await page.evaluate(() => {
    const e = document.getElementById("solution");
    return { top: e.getBoundingClientRect().top + window.scrollY, h: e.offsetHeight };
  });
  for (const i of vp.steps) {
    const y = sec.top + (sec.h - vp.height) * ((i + 0.5) / 7);
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(LONG.has(i) ? 7000 : 3200);
    await page.screenshot({ path: `${out}/${vp.name}-2-ecran-${i + 1}.jpg`, quality: 80 });
  }

  // Phase 3 : l'inscription.
  await page.locator("#waitlist").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  await page.locator("#waitlist").screenshot({ path: `${out}/${vp.name}-3-inscription.jpg`, quality: 80 });
  await page.locator("footer").screenshot({ path: `${out}/${vp.name}-pied-de-page.jpg`, quality: 80 });
  console.log("✓", vp.name);
  await ctx.close();
}

// Fenêtres et états du formulaire (mobile et laptop).
for (const vp of [VIEWPORTS[1], VIEWPORTS[3]].filter((v) => !only || only.includes(v.name))) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.mobile, hasTouch: vp.mobile });
  const page = await ctx.newPage();
  await page.goto(base + "/#faq", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${out}/${vp.name}-fenetre-faq.jpg`, quality: 80 });
  await page.keyboard.press("Escape");
  await page.goto(base + "/#partenaires", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${out}/${vp.name}-fenetre-partenaires.jpg`, quality: 80 });
  await page.keyboard.press("Escape");

  await page.goto(base + "/#waitlist", { waitUntil: "networkidle" });
  await page.waitForTimeout(1800);
  const form = page.locator('form[aria-label="Rejoindre la waitlist"]');
  await form.getByRole("button", { name: "Rejoindre la waitlist" }).click();
  await form.screenshot({ path: `${out}/${vp.name}-inscription-erreurs.jpg`, quality: 85 });
  await form.getByLabel("Prénom").fill("Capture");
  await form.getByLabel("Adresse e-mail").fill(`capture+${Date.now()}@exemple.fr`);
  await form.getByLabel(/Je veux être informé/).check();
  await form.getByRole("button", { name: "Rejoindre la waitlist" }).click();
  const done = page.getByRole("status").filter({ hasText: "Merci" });
  await done.waitFor();
  await page.waitForTimeout(1200);
  await done.screenshot({ path: `${out}/${vp.name}-inscription-confirmation.jpg`, quality: 85 });
  await ctx.close();
}
await browser.close();
