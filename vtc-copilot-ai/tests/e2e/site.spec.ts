import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PAGES = ["/", "/confidentialite/", "/mentions-legales/", "/desinscription/"];

test.describe("pages et SEO", () => {
  for (const path of PAGES) {
    test(`${path} se charge sans erreur console`, async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
      page.on("pageerror", (e) => errors.push(e.message));
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page).toHaveTitle(/VTC Copilot AI/);
      expect(await page.locator('meta[name="description"]').getAttribute("content")).toBeTruthy();
      await page.waitForLoadState("networkidle");
      expect(errors).toEqual([]);
    });
  }

  test("le HTML pré-rendu contient le contenu (sans JavaScript)", async ({ request }) => {
    const html = await (await request.get("/")).text();
    expect(html).toContain("Chaque course compte.");
    expect(html).toContain("Rejoindre la waitlist");
    expect(html).toContain('"@type":"FAQPage"');
    expect(html).toContain('lang="fr"');
  });

  test("une page inconnue renvoie 404", async ({ request }) => {
    const res = await request.get("/cette-page-n-existe-pas");
    expect(res.status()).toBe(404);
    expect(await res.text()).toContain("Cette page n’existe pas");
  });

  test("robots.txt et fichiers médias sont servis", async ({ request }) => {
    expect((await request.get("/robots.txt")).status()).toBe(200);
    for (const f of ["vtc-copilot-ai-film-1080p.mp4", "vtc-copilot-ai-film-720p.mp4", "vtc-copilot-ai-film-720p.webm", "vtc-copilot-ai-film-poster.webp", "og-image.jpg"]) {
      const r = await request.head(`/media/${f}`);
      expect(r.status(), f).toBe(200);
    }
  });

  test("tous les liens internes et ancres sont valides", async ({ page, request }) => {
    const seen = new Set<string>();
    for (const path of PAGES) {
      await page.goto(path);
      const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href")!));
      for (const href of hrefs) {
        if (/^(mailto:|https?:)/.test(href) || seen.has(href)) continue;
        seen.add(href);
        const [p, hash] = href.split("#");
        const target = p || path;
        if (!target.includes("?")) expect((await request.get(target)).status(), href).toBe(200);
        if (hash) {
          await page.goto(target);
          await expect(page.locator(`[id="${hash}"]`), href).toHaveCount(1);
          await page.goto(path);
        }
      }
    }
  });
});

test.describe("accessibilité", () => {
  for (const path of ["/", "/confidentialite/"]) {
    test(`axe WCAG 2.1 AA : ${path}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
      const summary = results.violations.map((v) => `${v.id} (${v.impact}) : ${v.nodes.length} élément(s) — ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`);
      expect(summary).toEqual([]);
    });
  }

  test("pas de défilement horizontal à 320 px", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto("/");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
});

test.describe("navigation", () => {
  test("menu mobile", async ({ page, isMobile }) => {
    test.skip(!isMobile, "mobile uniquement");
    await page.goto("/");
    const btn = page.getByRole("button", { name: "Ouvrir le menu" });
    await btn.click();
    await expect(page.locator("#menu-mobile")).toBeVisible();
    await page.locator("#menu-mobile").getByRole("link", { name: "FAQ" }).click();
    await expect(page.locator("#menu-mobile")).toBeHidden();
    await expect(page).toHaveURL(/#faq$/);
  });

  test("lien d'évitement au clavier", async ({ page, isMobile }) => {
    test.skip(isMobile, "clavier : desktop");
    await page.goto("/");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Aller au contenu" })).toBeFocused();
  });
});

test.describe("film", () => {
  test("affiche, contrôle de lecture et pause", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" }); // pas de lecture auto : on teste le bouton
    await page.goto("/");
    const video = page.getByTestId("film");
    await expect(video).toHaveAttribute("poster", /poster\.webp$/);
    await expect(video).toHaveAttribute("preload", "none");
    expect(await video.evaluate((v: HTMLVideoElement) => v.muted)).toBe(true);
    await page.getByRole("button", { name: /Voir le film/ }).click();
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused && v.currentTime > 0.3), { timeout: 10_000 }).toBe(true);
    const meta = await video.evaluate((v: HTMLVideoElement) => ({ d: v.duration, w: v.videoWidth, h: v.videoHeight }));
    expect(Math.round(meta.d)).toBe(20);
    expect(meta.w / meta.h).toBeCloseTo(16 / 9, 2);
    await video.hover();
    await page.getByRole("button", { name: "Mettre le film en pause" }).click();
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
  });
});

test.describe("démonstration", () => {
  test("boutons, onglets et clavier", async ({ page }) => {
    await page.goto("/#demo");
    const region = page.getByRole("region", { name: "Démonstration de l’application" });
    await expect(region.getByRole("group")).toHaveAttribute("aria-label", /^1 sur 4/);
    await region.getByRole("button", { name: "Diapositive suivante" }).click();
    await expect(region.getByRole("group")).toHaveAttribute("aria-label", /^2 sur 4/);
    await region.getByRole("tab", { name: /Étape 4/ }).click();
    await expect(region.getByRole("group")).toHaveAttribute("aria-label", /^4 sur 4/);
    await region.getByRole("button", { name: "Diapositive suivante" }).click();
    await expect(region.getByRole("group")).toHaveAttribute("aria-label", /^1 sur 4/);
    await region.focus();
    await page.keyboard.press("ArrowLeft");
    await expect(region.getByRole("group")).toHaveAttribute("aria-label", /^4 sur 4/);
  });

  test("lecture automatique interruptible", async ({ page }) => {
    await page.goto("/");
    await page.locator("#demo").scrollIntoViewIfNeeded();
    const region = page.getByRole("region", { name: "Démonstration de l’application" });
    await region.scrollIntoViewIfNeeded();
    const pause = region.getByRole("button", { name: "Mettre en pause" });
    await expect(pause).toBeVisible();
    await expect(region.getByRole("group")).toHaveAttribute("aria-label", /^2 sur 4/, { timeout: 9000 });
    await pause.click();
    await expect(region.getByRole("button", { name: "Lecture auto" })).toBeVisible();
    await page.waitForTimeout(7000);
    await expect(region.getByRole("group")).toHaveAttribute("aria-label", /^2 sur 4/);
  });

  test("animations réduites : pas de lecture automatique", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/#demo");
    const region = page.getByRole("region", { name: "Démonstration de l’application" });
    await expect(region.getByRole("button", { name: "Mettre en pause" })).toHaveCount(0);
  });
});
