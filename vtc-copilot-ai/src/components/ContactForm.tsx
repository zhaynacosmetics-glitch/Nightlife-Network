import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { LIMITS, validateContact } from "../lib/validation";

const input =
  "mt-1.5 block w-full rounded-2xl border border-line bg-white px-4 py-3 text-[16px] text-ink placeholder:text-faint focus:border-violet focus:outline-none focus:ring-4 focus:ring-violet/15";

/** Formulaire de contact (partenaires, presse, demandes liées aux données). Les messages sont stockés dans D1. */
export function ContactForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "sending") return;
    const fd = new FormData(e.currentTarget);
    const raw = Object.fromEntries(["name", "organisation", "email", "message"].map((k) => [k, String(fd.get(k) ?? "")]));
    const { data, errors: errs } = validateContact(raw);
    setErrors(errs);
    if (!data) {
      const first = ["name", "email", "message"].find((k) => errs[k]);
      if (first) (e.currentTarget.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }
    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...data, website: String(fd.get("website") ?? ""), elapsedMs: Date.now() - startedAt.current }),
      });
      const body = (await res.json().catch(() => ({}))) as { errors?: Record<string, string>; error?: string };
      if (res.ok) return setState("done");
      if (res.status === 400 && body.errors) {
        setErrors(body.errors);
        return setState("idle");
      }
      setMessage(body.error ?? "Le message n’a pas pu être envoyé. Réessayez dans quelques instants.");
      setState("error");
    } catch {
      setMessage("Connexion impossible. Vérifiez votre réseau puis réessayez.");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div role="status" className="rounded-[22px] border border-go/30 bg-go/[0.06] p-6">
        <CheckCircle2 size={28} className="text-go" aria-hidden />
        <p className="mt-3 text-lg font-semibold">Message envoyé.</p>
        <p className="mt-1 text-muted">Merci. Nous revenons vers vous à l’adresse indiquée.</p>
      </div>
    );
  }

  const err = (k: string) => errors[k] && <p id={`c-${k}-error`} className="mt-1.5 text-[13px] text-[#C42A3D]">{errors[k]}</p>;

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2" aria-label="Formulaire de contact">
      <div>
        <label htmlFor="c-name" className="text-[14px] font-medium">Nom</label>
        <input id="c-name" name="name" autoComplete="name" maxLength={50} className={input} aria-invalid={!!errors.name} aria-describedby={errors.name ? "c-name-error" : undefined} />
        {err("name")}
      </div>
      <div>
        <label htmlFor="c-org" className="text-[14px] font-medium">
          Organisation <span className="font-normal text-muted">(facultatif)</span>
        </label>
        <input id="c-org" name="organisation" autoComplete="organization" maxLength={LIMITS.orgMax} className={input} />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="c-email" className="text-[14px] font-medium">E-mail professionnel</label>
        <input id="c-email" name="email" type="email" inputMode="email" autoComplete="email" spellCheck={false} placeholder="nom@entreprise.fr" className={input} aria-invalid={!!errors.email} aria-describedby={errors.email ? "c-email-error" : undefined} />
        {err("email")}
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="c-message" className="text-[14px] font-medium">Votre message</label>
        <textarea id="c-message" name="message" rows={4} maxLength={LIMITS.messageMax} placeholder="Présentez votre projet ou votre demande…" className={`${input} resize-y`} aria-invalid={!!errors.message} aria-describedby={errors.message ? "c-message-error" : undefined} />
        {err("message")}
      </div>
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="c-website">Ne pas remplir ce champ</label>
        <input id="c-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="sm:col-span-2">
        <button type="submit" disabled={state === "sending"} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-6 font-medium text-white transition-colors hover:bg-[#23262f] disabled:cursor-wait disabled:opacity-80">
          {state === "sending" ? (
            <>
              <Loader2 size={18} className="animate-spin motion-reduce:animate-none" aria-hidden /> Envoi…
            </>
          ) : (
            "Envoyer le message"
          )}
        </button>
        <div aria-live="polite">{state === "error" && <p className="mt-3 text-sm text-[#C42A3D]">{message}</p>}</div>
        <p className="mt-3 text-[13px] text-muted">
          Votre message sert uniquement à vous répondre. <a className="underline underline-offset-2" href="/confidentialite/">Confidentialité</a>.
        </p>
      </div>
    </form>
  );
}
