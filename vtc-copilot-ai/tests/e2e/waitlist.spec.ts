import { expect, test } from "@playwright/test";

const unique = () => `test+${Date.now()}${Math.floor(Math.random() * 1e4)}@exemple.fr`;

test.describe("waitlist", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#waitlist");
    await page.waitForTimeout(1700); // délai anti-robot côté serveur
  });

  test("erreurs de validation côté client", async ({ page }) => {
    const form = page.locator("form[aria-labelledby=waitlist-form-title]");
    await form.getByRole("button", { name: "Rejoindre la waitlist" }).click();
    await expect(form.getByText("Indiquez votre prénom.")).toBeVisible();
    await expect(form.getByText("Indiquez votre adresse e-mail.")).toBeVisible();
    await expect(form.getByText(/Cochez cette case/)).toBeVisible();
    await expect(form.getByLabel("Prénom")).toBeFocused();
    await form.getByLabel("Adresse e-mail").fill("pas-un-email");
    await form.getByRole("button", { name: "Rejoindre la waitlist" }).click();
    await expect(form.getByText(/ne semble pas valide/)).toBeVisible();
  });

  test("inscription, doublon puis suppression", async ({ page }) => {
    const email = unique();
    const form = page.locator("form[aria-labelledby=waitlist-form-title]");
    await form.getByLabel("Prénom").fill("Karim");
    await form.getByLabel("Adresse e-mail").fill(`  ${email.toUpperCase()} `);
    await form.getByLabel(/Zone d’activité/).selectOption("93");
    await form.getByLabel(/J’accepte de recevoir/).check();
    await form.getByRole("button", { name: "Rejoindre la waitlist" }).click();
    const done = page.getByRole("status").filter({ hasText: "Merci Karim" });
    await expect(done).toBeVisible();
    const link = done.getByRole("link", { name: "Supprimer mon inscription" });
    const href = await link.getAttribute("href");
    expect(href).toMatch(/^\/desinscription\/\?t=[A-Za-z0-9_-]{43}$/);

    // Doublon (adresse normalisée)
    await page.reload();
    await page.waitForTimeout(1700);
    await form.getByLabel("Prénom").fill("Karim");
    await form.getByLabel("Adresse e-mail").fill(email);
    await form.getByLabel(/J’accepte de recevoir/).check();
    await form.getByRole("button", { name: "Rejoindre la waitlist" }).click();
    await expect(page.getByRole("status").filter({ hasText: "déjà inscrit" })).toBeVisible();

    // Suppression via le lien personnel
    await page.goto(href!);
    await page.getByRole("button", { name: "Supprimer définitivement mon inscription" }).click();
    await expect(page.getByText("ont été supprimées")).toBeVisible();
    // Le lien ne fonctionne qu'une fois
    await page.goto(href!);
    await page.getByRole("button", { name: "Supprimer définitivement mon inscription" }).click();
    await expect(page.getByText("n’est plus valide")).toBeVisible();
  });

  test("formulaire de contact", async ({ page }) => {
    await page.goto("/#partenaires");
    await page.waitForTimeout(1700);
    const form = page.getByRole("form", { name: "Formulaire de contact" });
    await form.getByLabel("Nom").fill("Claire Dupont");
    await form.getByLabel("E-mail professionnel").fill("claire@entreprise.fr");
    await form.getByLabel("Votre message").fill("Bonjour, nous aimerions échanger sur un pilote.");
    await form.getByRole("button", { name: "Envoyer le message" }).click();
    await expect(page.getByText("Message envoyé.")).toBeVisible();
  });
});

test.describe("API et sécurité", () => {
  test("validation serveur et protections", async ({ request }) => {
    const post = (data: object, headers: Record<string, string> = {}) => request.post("/api/waitlist", { data, headers });
    expect((await post({ firstName: "A", email: "x", elapsedMs: 5000 })).status()).toBe(400);
    expect((await post({ firstName: "A", email: "a@exemple.fr", consentMarketing: true, elapsedMs: 100 })).status()).toBe(429);
    expect((await post({ firstName: "A", email: "a@exemple.fr", consentMarketing: true, elapsedMs: 5000 }, { origin: "https://evil.example" })).status()).toBe(403);
    const bot = await post({ firstName: "Bot", email: "bot@exemple.fr", consentMarketing: true, website: "spam", elapsedMs: 5000 });
    expect(bot.status()).toBe(201);
    expect(await bot.json()).not.toHaveProperty("token");
    expect((await request.get("/api/waitlist")).status()).toBe(405);
    expect((await request.post("/api/waitlist", { data: "x", headers: { "content-type": "text/plain" } })).status()).toBe(415);
  });

  test("la liste des inscrits n'est jamais publique", async ({ request }) => {
    expect((await request.get("/api/admin/export")).status()).toBe(401);
    expect((await request.get("/api/admin/export", { headers: { authorization: "Bearer mauvais-jeton-mauvais-jeton" } })).status()).toBe(401);
    expect((await request.get("/api/admin/stats")).status()).toBe(401);
    const page = await (await request.get("/")).text();
    expect(page).not.toMatch(/ADMIN_TOKEN=|IP_HASH_SALT=/);
  });

  test("export CSV avec la clé d'administration", async ({ request }) => {
    test.skip(!process.env.E2E_ADMIN_TOKEN && !!process.env.E2E_BASE_URL, "clé non fournie");
    const token = process.env.E2E_ADMIN_TOKEN ?? "local-admin-token-for-tests-0123456789";
    const res = await request.get("/api/admin/export", { headers: { authorization: `Bearer ${token}` } });
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("text/csv");
    expect(await res.text()).toContain("email;first_name");
  });
});
