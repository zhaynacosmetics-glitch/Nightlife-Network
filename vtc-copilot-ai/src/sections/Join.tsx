import { Gift, MapPin, Sparkles } from "lucide-react";
import { Chip, VerdictPill } from "../components/Bubbles";
import { WaitlistForm } from "../components/WaitlistForm";
import { Container, Pop } from "../components/ui";
import { site } from "../config/site";

const nf = new Intl.NumberFormat("fr-FR");

/** Phase 3 : l'appel à l'action. */
export function Join() {
  const { goal, verifiedSignups } = site.waitlist;
  const progress = verifiedSignups === null ? null : Math.min(1, verifiedSignups / goal);

  return (
    <section id="waitlist" aria-labelledby="waitlist-title" className="relative overflow-x-clip bg-mist py-24 sm:py-32">
      <Container className="relative max-w-[640px] text-center">
        {/* Pop-ups décoratifs */}
        <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
          <Pop delay={0.2} rotate={-6} float className="absolute -left-64 top-8">
            <Chip tone="go" icon={<Gift size={16} aria-hidden />} label="Inscription" value="gratuite" />
          </Pop>
          <Pop delay={0.45} rotate={5} float className="absolute -right-60 top-28">
            <Chip tone="violet" icon={<MapPin size={16} aria-hidden />} label="Pilote" value="Île-de-France" />
          </Pop>
          <Pop delay={0.7} rotate={4} float className="absolute -left-56 bottom-40">
            <VerdictPill verdict="green" />
          </Pop>
          <Pop delay={0.95} rotate={-4} float className="absolute -right-64 bottom-24">
            <Chip tone="maybe" icon={<Sparkles size={16} aria-hidden />} label="Accès aux" value="premiers tests" />
          </Pop>
        </div>

        <Pop>
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 text-[13px] font-medium text-muted">
            Objectif : {nf.format(goal)} chauffeurs VTC
          </span>
        </Pop>
        <h2 id="waitlist-title" className="display mt-6 text-[clamp(2.6rem,7vw,4.8rem)]">
          Soyez parmi les premiers.
        </h2>
        <p className="mx-auto mt-4 max-w-[34ch] text-[clamp(1.05rem,1.8vw,1.25rem)] text-muted">Gratuit, sans engagement. On vous prévient dès le lancement.</p>

        {progress !== null && verifiedSignups !== null && (
          <div className="mx-auto mt-6 max-w-[360px]">
            <p className="text-sm text-muted">
              {nf.format(verifiedSignups)} inscriptions vérifiées sur un objectif de {nf.format(goal)}
            </p>
            <div className="mt-2 h-2 rounded-full bg-white">
              <div className="h-full rounded-full bg-go" style={{ width: `${progress * 100}%` }} />
            </div>
          </div>
        )}

        <div className="mt-10">
          <WaitlistForm />
        </div>
      </Container>
    </section>
  );
}
