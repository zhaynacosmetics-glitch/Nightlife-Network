// Validation partagée entre le formulaire (navigateur) et le Worker (serveur).
// Le serveur ne fait jamais confiance au client : il ré-exécute ces mêmes règles.

export const ZONES = ["75", "77", "78", "91", "92", "93", "94", "95", "idf", "hors-idf"] as const;
export type ZoneValue = (typeof ZONES)[number];

export const LIMITS = {
  firstNameMax: 50,
  emailMax: 254,
  orgMax: 120,
  messageMax: 2000,
  /** Délai minimal (ms) entre l'affichage du formulaire et l'envoi : en dessous, c'est probablement un robot. */
  minFillMs: 2500,
} as const;

/** Met l'adresse en minuscules, retire les espaces et normalise l'Unicode. */
export function normalizeEmail(raw: string): string {
  return raw.normalize("NFKC").trim().toLowerCase();
}

// Volontairement pragmatique : une partie locale ASCII courante, un domaine avec au moins un point.
const EMAIL_RE = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/;

export function isValidEmail(email: string): boolean {
  if (email.length < 6 || email.length > LIMITS.emailMax) return false;
  if (!EMAIL_RE.test(email)) return false;
  const [local, domain] = email.split("@");
  if (local.length > 64 || local.startsWith(".") || local.endsWith(".") || local.includes("..")) return false;
  const tld = domain.split(".").pop() ?? "";
  return /^[a-z]{2,24}$/.test(tld) || /^xn--[a-z0-9-]{2,59}$/.test(tld);
}

export function cleanName(raw: string): string {
  // eslint-disable-next-line no-control-regex -- suppression volontaire des caractères de contrôle
  return raw.normalize("NFKC").replace(/[\u0000-\u001f\u007f<>]/g, "").replace(/\s+/g, " ").trim();
}

export function isValidName(name: string): boolean {
  return name.length >= 1 && name.length <= LIMITS.firstNameMax && /^[\p{L}\p{M}' .-]+$/u.test(name);
}

export function cleanText(raw: string, max: number): string {
  // eslint-disable-next-line no-control-regex -- suppression volontaire des caractères de contrôle
  return raw.normalize("NFKC").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").trim().slice(0, max);
}

export interface WaitlistInput {
  firstName: string;
  email: string;
  zone: ZoneValue | "";
  consentMarketing: boolean;
  consentResearch: boolean;
}

export type FieldErrors = Partial<Record<"firstName" | "email" | "zone" | "consentMarketing" | "organisation" | "message", string>>;

export function validateWaitlist(raw: Record<string, unknown>): { data?: WaitlistInput; errors: FieldErrors } {
  const errors: FieldErrors = {};
  const firstName = cleanName(String(raw.firstName ?? ""));
  const email = normalizeEmail(String(raw.email ?? ""));
  const zoneRaw = String(raw.zone ?? "");
  const consentMarketing = raw.consentMarketing === true || raw.consentMarketing === "on" || raw.consentMarketing === "true";
  const consentResearch = raw.consentResearch === true || raw.consentResearch === "on" || raw.consentResearch === "true";

  if (!firstName) errors.firstName = "Indiquez votre prénom.";
  else if (!isValidName(firstName)) errors.firstName = `Utilisez uniquement des lettres (${LIMITS.firstNameMax} caractères maximum).`;

  if (!email) errors.email = "Indiquez votre adresse e-mail.";
  else if (!isValidEmail(email)) errors.email = "Cette adresse e-mail ne semble pas valide. Exemple : prenom@exemple.fr";

  const zone = (ZONES as readonly string[]).includes(zoneRaw) ? (zoneRaw as ZoneValue) : "";
  if (zoneRaw && !zone) errors.zone = "Choisissez une zone dans la liste.";

  if (!consentMarketing) errors.consentMarketing = "Cochez cette case pour recevoir les informations de lancement.";

  if (Object.keys(errors).length) return { errors };
  return { data: { firstName, email, zone, consentMarketing, consentResearch }, errors };
}

export interface ContactInput {
  name: string;
  organisation: string;
  email: string;
  message: string;
}

export function validateContact(raw: Record<string, unknown>): { data?: ContactInput; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  const name = cleanName(String(raw.name ?? ""));
  const organisation = cleanText(String(raw.organisation ?? ""), LIMITS.orgMax);
  const email = normalizeEmail(String(raw.email ?? ""));
  const message = cleanText(String(raw.message ?? ""), LIMITS.messageMax + 1);

  if (!name || !isValidName(name)) errors.name = "Indiquez votre nom (lettres uniquement).";
  if (!isValidEmail(email)) errors.email = "Indiquez une adresse e-mail valide. Exemple : prenom@exemple.fr";
  if (message.length < 10) errors.message = "Décrivez votre demande en quelques mots (10 caractères minimum).";
  else if (message.length > LIMITS.messageMax) errors.message = `Votre message dépasse ${LIMITS.messageMax} caractères.`;

  if (Object.keys(errors).length) return { errors };
  return { data: { name, organisation, email, message }, errors };
}
