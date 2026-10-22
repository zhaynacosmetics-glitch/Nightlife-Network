import { site } from "../config/site";
import { Container } from "../components/ui";
import { WaitlistForm } from "../components/WaitlistForm";

const nf = new Intl.NumberFormat("fr-FR");

// Positions stylisées des départements franciliens (illustration, pas une carte exacte).
const DEPTS: [string, number, number][] = [
  ["75", 200, 150],
  ["92", 160, 165],
  ["93", 238, 128],
  ["94", 232, 186],
  ["95", 168, 74],
  ["78", 84, 170],
  ["91", 180, 262],
  ["77", 316, 196],
];

export function Waitlist() {
  const { goal, verifiedSignups } = site.waitlist;
  const progress = verifiedSignups === null ? null : Math.min(1, verifiedSignups / goal);

  return (
    <section id="waitlist" aria-labelledby="waitlist-title" className="relative overflow-hidden py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_15%_20%,rgba(124,92,255,0.32),transparent_70%),radial-gradient(60%_60%_at_90%_90%,rgba(56,182,255,0.22),transparent_70%)]" />
      <Container className="relative grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <div>
          <h2 id="waitlist-title" className="display text-[clamp(2rem,4.4vw,3.2rem)]">
            Notre objectif : réunir {nf.format(goal)} chauffeurs VTC en <span className="whitespace-nowrap">Île-de-France</span>.
          </h2>
          <p className="mt-6 max-w-[50ch] text-lg leading-relaxed text-muted">
            Inscrivez-vous pour suivre le lancement de VTC Copilot AI et contribuer à la construction d’un copilote adapté à votre activité.
          </p>

          <figure className="mt-10 rounded-[26px] border border-white/10 bg-white/[0.03] p-6">
            <svg viewBox="0 0 400 320" className="h-auto w-full" role="img" aria-label="Carte stylisée des huit départements d’Île-de-France concernés par le lancement">
              <path d="M30 160 C 24 80 110 22 200 26 S 382 74 384 170 S 330 302 214 306 S 36 270 30 160 Z" fill="rgba(124,92,255,0.08)" stroke="rgba(160,172,255,0.3)" strokeDasharray="4 6" />
              <ellipse cx="204" cy="160" rx="92" ry="74" fill="none" stroke="rgba(160,172,255,0.2)" />
              <ellipse cx="200" cy="152" rx="36" ry="26" fill="rgba(56,182,255,0.12)" stroke="rgba(160,172,255,0.5)" />
              {DEPTS.map(([n, x, y]) => (
                <g key={n}>
                  <circle cx={x} cy={y} r="17" fill="#10193f" stroke="rgba(124,92,255,0.7)" strokeWidth="1.5" />
                  <text x={x} y={y + 4.5} textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#EAEDFF">
                    {n}
                  </text>
                </g>
              ))}
            </svg>
            <figcaption className="mt-4 flex flex-wrap items-end justify-between gap-4">
              <span>
                <span className="display block text-5xl tabular">{nf.format(goal)}</span>
                <span className="text-muted">chauffeurs : notre objectif de recrutement</span>
              </span>
              {progress !== null && verifiedSignups !== null && (
                <span className="w-full">
                  <span className="block text-sm text-muted">
                    {nf.format(verifiedSignups)} inscriptions vérifiées à ce jour
                  </span>
                  <span className="mt-2 block h-2 rounded-full bg-white/10">
                    <span className="block h-full rounded-full bg-go" style={{ width: `${progress * 100}%` }} />
                  </span>
                </span>
              )}
            </figcaption>
          </figure>
        </div>

        <div className="lg:pt-4">
          <WaitlistForm />
        </div>
      </Container>
    </section>
  );
}
