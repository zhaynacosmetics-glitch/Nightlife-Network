// Configuration centrale du site VTC Copilot AI.
// Tous les textes de marque, liens, coordonnées et paramètres modifiables sont ici.
// Aucune valeur secrète : ce fichier est inclus dans le code public.

export const site = {
  name: "VTC Copilot AI",
  tagline: "Roulez plus intelligemment.",
  /**
   * URL publique canonique, sans slash final (ex. "https://vtc-copilot-ai.mon-compte.workers.dev").
   * Peut aussi être fournie au build par la variable d'environnement SITE_URL.
   * Vide = pas de balise canonical ni de sitemap (à renseigner dès que l'URL est connue).
   */
  url: "",
  locale: "fr_FR",
  description:
    "VTC Copilot AI, l’assistant d’aide à la décision des chauffeurs VTC en Île-de-France : évaluez la rentabilité de chaque course en tenant compte du prix, de l’approche, de la durée, de la destination et de vos coûts réels.",

  /** Coordonnées. Laisser vide une valeur non confirmée : elle ne sera pas affichée. */
  contact: {
    email: "",
  },

  /** Informations légales de l'éditeur (obligatoires en France). À compléter avant toute diffusion large. */
  legal: {
    publisher: "",
    status: "",
    address: "",
    registration: "",
    publicationDirector: "",
    host: "Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, États-Unis — cloudflare.com",
    lastUpdate: "22 octobre 2026",
  },

  waitlist: {
    /** Objectif de recrutement : jamais présenté comme atteint. */
    goal: 10000,
    /**
     * Nombre réel d'inscriptions vérifiées, mis à jour à la main à partir de l'export.
     * null = aucun compteur n'est affiché, seul l'objectif l'est.
     */
    verifiedSignups: null as number | null,
    /** Durée de conservation annoncée dans la politique de confidentialité. */
    retentionMonths: 24,
    zones: [
      { value: "75", label: "Paris (75)" },
      { value: "77", label: "Seine-et-Marne (77)" },
      { value: "78", label: "Yvelines (78)" },
      { value: "91", label: "Essonne (91)" },
      { value: "92", label: "Hauts-de-Seine (92)" },
      { value: "93", label: "Seine-Saint-Denis (93)" },
      { value: "94", label: "Val-de-Marne (94)" },
      { value: "95", label: "Val-d’Oise (95)" },
      { value: "idf", label: "Toute l’Île-de-France" },
      { value: "hors-idf", label: "Hors Île-de-France" },
    ],
  },

  /** Clé publique Cloudflare Turnstile (facultative). Vide = protection par pot de miel, délai minimal et limitation de débit. */
  turnstileSiteKey: "",

  media: {
    film1080: "/media/vtc-copilot-ai-film-1080p.mp4",
    film720: "/media/vtc-copilot-ai-film-720p.mp4",
    film1080Webm: "/media/vtc-copilot-ai-film-1080p.webm",
    film720Webm: "/media/vtc-copilot-ai-film-720p.webm",
    poster: "/media/vtc-copilot-ai-film-poster.webp",
    posterJpg: "/media/vtc-copilot-ai-film-poster.jpg",
    ogImage: "/media/og-image.jpg",
  },

  nav: [
    { href: "/#solution", label: "Solution" },
    { href: "/#demo", label: "Démo" },
    { href: "/#partenaires", label: "Partenaires" },
    { href: "/#faq", label: "FAQ" },
  ],
} as const;

export type Zone = (typeof site.waitlist.zones)[number]["value"];
