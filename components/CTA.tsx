import { Reveal } from "./Reveal";
import { StoreButtons } from "./ui";
import { QrCode, BrandMark } from "./icons";

export function CTA() {
  return (
    <section id="download" className="relative overflow-hidden bg-ink py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/20 blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-neon/20 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-violet-deep/40 via-ink to-ink p-8 text-center sm:p-14">
            <div className="absolute inset-0 grain opacity-[0.06]" />
            <div className="relative">
              <BrandMark className="mx-auto h-16 w-16 animate-float" />
              <h2 className="display mx-auto mt-6 max-w-3xl text-5xl uppercase text-white sm:text-7xl">
                Feel the night,
                <br />
                <span className="gradient-text">share the vibe.</span>
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-lg text-white/65">
                Rejoins les +12 000 membres qui ne ratent plus aucune soirée.
                Télécharge One Night, c&apos;est gratuit.
              </p>

              <div className="mt-9 flex flex-col items-center gap-8 sm:flex-row sm:justify-center">
                <StoreButtons className="justify-center" />
                <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 p-3">
                  <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-ink">
                    <QrCode className="h-10 w-10" />
                  </span>
                  <p className="max-w-[8rem] text-left text-xs text-white/60">
                    Scanne pour télécharger sur mobile
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
