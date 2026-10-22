// Pré-rendu statique : génère un HTML complet (SEO, partage social, affichage sans JavaScript) pour chaque route.
import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = path.resolve(import.meta.dirname, "..");
const dist = path.join(root, "dist");
const ssrDir = path.join(root, ".ssr");
const ssrEntry = readdirSync(ssrDir).find((f) => f.startsWith("entry-server") && f.endsWith(".js"));
const { render, ROUTES, site, FAQ } = await import(pathToFileURL(path.join(ssrDir, ssrEntry)).href);

// URL publique : variable d'environnement SITE_URL (ex. https://vtc-copilot-ai.monsous-domaine.workers.dev), sinon config.
const siteUrl = (process.env.SITE_URL || site.url || "").replace(/\/$/, "");
const template = readFileSync(path.join(dist, "index.html"), "utf8");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

// Précharge la police variable latine (évite le saut de mise en page).
const assets = readdirSync(path.join(dist, "assets"));
const font = assets.find((f) => /^archivo-latin-wdth-normal.*\.woff2$/.test(f));
const fontPreload = font ? `<link rel="preload" href="/assets/${font}" as="font" type="font/woff2" crossorigin />` : "";

function jsonLd(route) {
  if (route.path !== "/") return "";
  const graph = [
    { "@type": "Organization", "@id": `${siteUrl}/#org`, name: site.name, url: `${siteUrl}/`, logo: `${siteUrl}/favicon.svg` },
    { "@type": "WebSite", "@id": `${siteUrl}/#website`, name: site.name, url: `${siteUrl}/`, inLanguage: "fr-FR", publisher: { "@id": `${siteUrl}/#org` } },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
    {
      "@type": "VideoObject",
      name: "VTC Copilot AI, le film de présentation",
      description: "Film motion design de 20 secondes présentant le concept de VTC Copilot AI (données fictives).",
      thumbnailUrl: `${siteUrl}${site.media.posterJpg}`,
      contentUrl: `${siteUrl}${site.media.film1080}`,
      uploadDate: "2026-10-22",
      duration: "PT20S",
    },
  ];
  return `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c")}</script>`;
}

for (const route of ROUTES) {
  const url = `${siteUrl}${route.path === "/404" ? "/" : route.path}`;
  const og = `${siteUrl}${site.media.ogImage}`;
  const head = [
    `<title>${esc(route.title)}</title>`,
    `<meta name="description" content="${esc(route.description)}" />`,
    route.index ? "" : `<meta name="robots" content="noindex" />`,
    route.index && siteUrl ? `<link rel="canonical" href="${url}" />` : "",
    `<meta name="referrer" content="strict-origin-when-cross-origin" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${site.name}" />`,
    `<meta property="og:locale" content="${site.locale}" />`,
    `<meta property="og:title" content="${esc(route.title)}" />`,
    `<meta property="og:description" content="${esc(route.description)}" />`,
    siteUrl ? `<meta property="og:url" content="${url}" />` : "",
    `<meta property="og:image" content="${og}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="Logo VTC Copilot AI et la signature « Roulez plus intelligemment. »" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    route.path === "/" ? `<link rel="preload" href="${site.media.poster}" as="image" type="image/webp" fetchpriority="high" />` : "",
    fontPreload,
    jsonLd(route),
  ]
    .filter(Boolean)
    .join("\n    ");

  const html = template.replace("<!--head-->", head).replace("<!--route-->", route.file).replace("<!--app-->", render(route.file));
  const out = path.join(dist, route.file);
  mkdirSync(path.dirname(out), { recursive: true });
  writeFileSync(out, html);
  console.log("✓", route.file);
}

const indexed = ROUTES.filter((r) => r.index);
writeFileSync(
  path.join(dist, "robots.txt"),
  `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /desinscription/\n${siteUrl ? `\nSitemap: ${siteUrl}/sitemap.xml\n` : ""}`,
);
if (siteUrl) {
  writeFileSync(
    path.join(dist, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexed
      .map((r) => `  <url><loc>${siteUrl}${r.path}</loc><lastmod>2026-10-22</lastmod></url>`)
      .join("\n")}\n</urlset>\n`,
  );
}
rmSync(ssrDir, { recursive: true, force: true });
console.log(`Pré-rendu terminé (${ROUTES.length} pages, URL publique : ${siteUrl || "non définie"}).`);
