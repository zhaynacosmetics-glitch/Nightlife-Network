import { execSync } from "node:child_process";

// Applique les migrations sur la base locale et vide la table de limitation de débit avant chaque campagne.
export default function globalSetup() {
  if (process.env.E2E_BASE_URL) return; // tests sur un site déployé : on ne touche à rien
  execSync("npx wrangler d1 migrations apply vtc-copilot-ai-waitlist --local", { stdio: "ignore" });
  execSync('npx wrangler d1 execute vtc-copilot-ai-waitlist --local --command "DELETE FROM rate_events"', { stdio: "ignore" });
}
