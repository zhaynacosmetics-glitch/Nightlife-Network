import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { Plus, X } from "lucide-react";
import { Building2, Car, ShieldCheck } from "lucide-react";
import { ContactForm } from "./ContactForm";
import { FAQ } from "../content/faq";

const DIALOGS = ["faq", "partenaires"];

/** Fenêtre modale (élément <dialog> natif : focus, Échap et lecteur d'écran gérés par le navigateur). */
function Modal({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <dialog
      ref={ref}
      id={id}
      aria-labelledby={`${id}-title`}
      onClick={(e) => e.target === ref.current && ref.current?.close()}
      onClose={() => {
        // Retire l'ancre pour qu'un nouveau clic sur le lien rouvre la fenêtre.
        if (window.location.hash === `#${id}`) history.replaceState(null, "", window.location.pathname + window.location.search);
      }}
      className="pop-dialog m-auto max-h-[min(88svh,760px)] w-[min(680px,calc(100%-24px))] overflow-y-auto overscroll-contain rounded-[28px] border border-line bg-white p-0 text-ink shadow-[0_50px_100px_-30px_rgba(11,13,18,0.45)]"
    >
      <div className="sticky top-0 z-10 flex items-center gap-4 border-b border-line bg-white/95 px-6 py-4 backdrop-blur sm:px-8">
        <h2 id={`${id}-title`} className="text-[20px] font-semibold tracking-[-0.02em]">
          {title}
        </h2>
        <button type="button" onClick={() => ref.current?.close()} className="ml-auto grid size-10 place-items-center rounded-full bg-mist transition-colors hover:bg-line" aria-label="Fermer">
          <X size={18} aria-hidden />
        </button>
      </div>
      <div className="px-6 pb-8 pt-4 sm:px-8">{children}</div>
    </dialog>
  );
}

const PARTNERS = [
  { icon: Car, label: "Plateformes et flottes VTC" },
  { icon: ShieldCheck, label: "Assureurs, loueurs, financeurs" },
  { icon: Building2, label: "Organisations de chauffeurs" },
];

/** FAQ et contact partenaires, ouverts depuis la navigation et le pied de page. */
export function Dialogs() {
  // Ouvre la fenêtre demandée par l'ancre de l'URL (/#faq, /#partenaires).
  useEffect(() => {
    const open = () => {
      const id = window.location.hash.slice(1);
      if (!DIALOGS.includes(id)) return;
      const d = document.getElementById(id);
      if (d instanceof HTMLDialogElement && !d.open) d.showModal();
    };
    open();
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
  }, []);

  return (
    <>
      <Modal id="faq" title="Questions fréquentes">
        <div className="divide-y divide-line">
          {FAQ.map((f) => (
            <details key={f.q} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 text-[16px] font-medium [&::-webkit-details-marker]:hidden">
                {f.q}
                <Plus size={18} className="flex-none text-violet transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none" aria-hidden />
              </summary>
              <p className="pb-5 text-[15px] leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </Modal>
      <Modal id="partenaires" title="Partenaires et contact">
        <p className="text-[15px] leading-relaxed text-muted">Vous voulez construire VTC Copilot AI avec nous ? Écrivez-nous. Aucun partenariat n’est conclu à ce jour.</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {PARTNERS.map(({ icon: Icon, label }) => (
            <li key={label} className="inline-flex items-center gap-2 rounded-full bg-mist px-3 py-1.5 text-[13.5px]">
              <Icon size={15} className="text-violet" aria-hidden />
              {label}
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <ContactForm />
        </div>
      </Modal>
    </>
  );
}
