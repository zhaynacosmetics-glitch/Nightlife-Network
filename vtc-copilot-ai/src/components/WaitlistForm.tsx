import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { site } from "../config/site";
import { validateWaitlist } from "../lib/validation";
import type { FieldErrors } from "../lib/validation";
import { Turnstile } from "./Turnstile";

type State = { kind: "idle" } | { kind: "sending" } | { kind: "done"; already: boolean; token?: string; firstName: string } | { kind: "error"; message: string };

const FIELD_ORDER = ["firstName", "email", "zone", "consentMarketing"] as const;

const input =
  "mt-2 block w-full rounded-xl border bg-white/[0.04] px-4 py-3.5 text-[16px] text-text placeholder:text-muted/70 transition-[border-color,box-shadow] focus:border-signal focus:outline-none focus:ring-4 focus:ring-signal/25";

export function WaitlistForm() {
  const [state, setState] = useState<State>({ kind: "idle" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const startedAt = useRef<number>(0);
  const turnstileToken = useRef<string>("");
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state.kind === "sending") return;
    const fd = new FormData(e.currentTarget);
    const raw = {
      firstName: String(fd.get("firstName") ?? ""),
      email: String(fd.get("email") ?? ""),
      zone: String(fd.get("zone") ?? ""),
      consentMarketing: fd.get("consentMarketing") === "on",
      consentResearch: fd.get("consentResearch") === "on",
    };
    const { data, errors: errs } = validateWaitlist(raw);
    setErrors(errs);
    if (!data) {
      const first = FIELD_ORDER.find((k) => errs[k]);
      if (first) (form.current?.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }

    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...data,
          website: String(fd.get("website") ?? ""),
          elapsedMs: Date.now() - startedAt.current,
          turnstileToken: turnstileToken.current,
        }),
      });
      const body = (await res.json().catch(() => ({}))) as { status?: string; token?: string; errors?: FieldErrors; error?: string };
      if (res.ok && (body.status === "created" || body.status === "already")) {
        setState({ kind: "done", already: body.status === "already", token: body.token, firstName: data.firstName });
        return;
      }
      if (res.status === 400 && body.errors) {
        setErrors(body.errors);
        setState({ kind: "idle" });
        return;
      }
      setState({ kind: "error", message: body.error ?? "L’inscription n’a pas pu être enregistrée. Réessayez dans quelques instants." });
    } catch {
      setState({ kind: "error", message: "Connexion impossible. Vérifiez votre réseau puis réessayez." });
    }
  }

  if (state.kind === "done") {
    const link = state.token ? `/desinscription/?t=${encodeURIComponent(state.token)}` : null;
    return (
      <div role="status" className="rounded-[26px] border border-go/40 bg-go/[0.07] p-7 sm:p-9">
        <CheckCircle2 size={36} className="text-go" aria-hidden />
        <h3 className="display mt-4 text-3xl">{state.already ? "Vous êtes déjà inscrit·e." : `Merci ${state.firstName}, c’est enregistré.`}</h3>
        <p className="mt-3 leading-relaxed text-muted">
          {state.already
            ? "Cette adresse figure déjà sur la waitlist : inutile de vous réinscrire. Vous recevrez les informations de lancement."
            : "Vous recevrez les informations de lancement de VTC Copilot AI en Île-de-France. Aucune autre utilisation de vos données."}
        </p>
        {link && (
          <p className="mt-5 text-sm leading-relaxed text-muted">
            Conservez ce lien : il permet de supprimer votre inscription à tout moment.
            <br />
            <a className="break-all font-medium text-signal underline underline-offset-4" href={link}>
              Supprimer mon inscription
            </a>
          </p>
        )}
      </div>
    );
  }

  const sending = state.kind === "sending";
  const err = (k: keyof FieldErrors) =>
    errors[k] ? (
      <p id={`${k}-error`} className="mt-2 text-sm text-stop">
        {errors[k]}
      </p>
    ) : null;
  const border = (k: keyof FieldErrors) => (errors[k] ? "border-stop/70" : "border-white/15");

  return (
    <form ref={form} noValidate onSubmit={onSubmit} className="rounded-[26px] border border-white/12 bg-[linear-gradient(180deg,rgba(22,34,79,0.9),rgba(16,25,63,0.9))] p-6 shadow-[0_40px_100px_-40px_rgba(124,92,255,0.8)] sm:p-8" aria-labelledby="waitlist-form-title">
      <h3 id="waitlist-form-title" className="text-xl font-semibold">
        Rejoindre la waitlist
      </h3>
      <p className="mt-1 text-sm text-muted">Trois informations, moins d’une minute.</p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="text-[15px] font-medium">
            Prénom
          </label>
          <input id="firstName" name="firstName" type="text" autoComplete="given-name" maxLength={50} placeholder="Karim…" required aria-invalid={!!errors.firstName} aria-describedby={errors.firstName ? "firstName-error" : undefined} className={`${input} ${border("firstName")}`} />
          {err("firstName")}
        </div>
        <div>
          <label htmlFor="zone" className="text-[15px] font-medium">
            Zone d’activité <span className="font-normal text-muted">(facultatif)</span>
          </label>
          <select id="zone" name="zone" defaultValue="" aria-invalid={!!errors.zone} aria-describedby={errors.zone ? "zone-error" : undefined} className={`${input} ${border("zone")} appearance-none bg-[#121b44] text-text`}>
            <option value="">Choisir…</option>
            {site.waitlist.zones.map((z) => (
              <option key={z.value} value={z.value}>
                {z.label}
              </option>
            ))}
          </select>
          {err("zone")}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="email" className="text-[15px] font-medium">
            Adresse e-mail
          </label>
          <input id="email" name="email" type="email" inputMode="email" autoComplete="email" spellCheck={false} maxLength={254} placeholder="prenom@exemple.fr" required aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} className={`${input} ${border("email")}`} />
          {err("email")}
        </div>
      </div>

      {/* Pot de miel : invisible pour les humains, rempli par les robots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Ne pas remplir ce champ</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-6 space-y-3">
        <label className="flex cursor-pointer gap-3 rounded-xl p-1 text-[15px] leading-relaxed">
          <input type="checkbox" name="consentMarketing" aria-invalid={!!errors.consentMarketing} aria-describedby={errors.consentMarketing ? "consentMarketing-error" : undefined} className="mt-1 size-5 flex-none accent-violet" />
          <span>
            J’accepte de recevoir par e-mail des informations sur le lancement de VTC Copilot AI. Je peux me désinscrire à tout moment.
          </span>
        </label>
        {err("consentMarketing")}
        <label className="flex cursor-pointer gap-3 rounded-xl p-1 text-[15px] leading-relaxed text-muted">
          <input type="checkbox" name="consentResearch" className="mt-1 size-5 flex-none accent-violet" />
          <span>Facultatif : j’accepte d’être contacté·e pour participer à des entretiens ou à des tests du produit.</span>
        </label>
      </div>

      {site.turnstileSiteKey && <Turnstile siteKey={site.turnstileSiteKey} onToken={(t) => (turnstileToken.current = t)} />}

      <button type="submit" disabled={sending} className="mt-7 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(100deg,var(--color-violet),#5b7cff_55%,var(--color-signal))] px-6 py-3.5 text-[16px] font-semibold text-white shadow-[0_12px_40px_-12px_rgba(124,92,255,0.9)] transition-[filter,transform] hover:brightness-110 active:scale-[0.99] disabled:cursor-wait disabled:opacity-80">
        {sending ? (
          <>
            <Loader2 size={18} className="animate-spin motion-reduce:animate-none" aria-hidden /> Inscription en cours…
          </>
        ) : (
          "Rejoindre la waitlist"
        )}
      </button>
      <div aria-live="polite">{state.kind === "error" && <p className="mt-4 rounded-xl border border-stop/40 bg-stop/10 px-4 py-3 text-sm">{state.message}</p>}</div>
      <p className="mt-5 text-[13px] leading-relaxed text-muted">
        Vos données servent uniquement à vous informer du lancement et, si vous l’acceptez, à vous proposer de participer aux tests. Elles ne sont ni vendues ni cédées. Conservation : {site.waitlist.retentionMonths} mois au maximum.{" "}
        <a href="/confidentialite/" className="underline underline-offset-2 hover:text-text">
          Politique de confidentialité
        </a>
        .
      </p>
    </form>
  );
}
