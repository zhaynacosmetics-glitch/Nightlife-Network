import { useState, useSyncExternalStore } from "react";
import { Loader2 } from "lucide-react";
import { Prose } from "./Legal";

type State = "idle" | "sending" | "done" | "invalid" | "error";

export function Unsubscribe() {
  // Jeton lu dans l'URL côté navigateur uniquement (le pré-rendu n'en a pas).
  const token = useSyncExternalStore(
    () => () => {},
    () => new URLSearchParams(window.location.search).get("t"),
    () => null,
  );
  const [state, setState] = useState<State>("idle");

  async function remove() {
    if (!token) return;
    setState("sending");
    try {
      const res = await fetch("/api/waitlist/delete", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token }) });
      setState(res.ok ? "done" : res.status === 404 || res.status === 400 ? "invalid" : "error");
    } catch {
      setState("error");
    }
  }

  return (
    <Prose title="Supprimer mon inscription">
      {state === "done" ? (
        <p role="status" className="text-ink">Votre inscription et les données associées ont été supprimées. Vous ne recevrez plus de message de notre part.</p>
      ) : (
        <>
          <p>Cette action supprime définitivement votre prénom, votre adresse e-mail et vos choix de consentement de la waitlist VTC Copilot AI.</p>
          {token ? (
            <button type="button" onClick={remove} disabled={state === "sending"} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#C42A3D] px-6 font-medium text-white disabled:opacity-80">
              {state === "sending" && <Loader2 size={18} className="animate-spin motion-reduce:animate-none" aria-hidden />}
              {state === "sending" ? "Suppression…" : "Supprimer définitivement mon inscription"}
            </button>
          ) : (
            <p>Ce lien est incomplet. Utilisez le lien reçu après votre inscription, ou faites votre demande via le <a href="/#partenaires">formulaire de contact</a>.</p>
          )}
          <div aria-live="polite">
            {state === "invalid" && <p className="text-[#C42A3D]">Ce lien n’est plus valide : l’inscription a peut-être déjà été supprimée.</p>}
            {state === "error" && <p className="text-[#C42A3D]">La suppression n’a pas abouti. Réessayez dans quelques instants ou contactez-nous.</p>}
          </div>
        </>
      )}
    </Prose>
  );
}
