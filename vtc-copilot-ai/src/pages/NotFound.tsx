import { ButtonLink } from "../components/ui";
import { Prose } from "./Legal";

export function NotFound() {
  return (
    <Prose title="Cette page n’existe pas">
      <p>L’adresse demandée est introuvable. Revenez à l’accueil pour découvrir VTC Copilot AI.</p>
      <ButtonLink href="/">Retour à l’accueil</ButtonLink>
    </Prose>
  );
}
