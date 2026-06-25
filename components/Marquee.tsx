const items = [
  "White & Pen",
  "Oriental Party",
  "Années 80",
  "Genève",
  "Lausanne",
  "Rooftop Sessions",
  "Techno Night",
  "Afro Vibes",
  "Sunset Club",
  "Paris",
];

export function Marquee() {
  return (
    <section
      aria-label="Soirées et villes partenaires"
      className="border-y border-white/10 bg-ink py-6"
    >
      <div className="mask-fade-x overflow-hidden">
        <div className="flex w-max animate-marquee items-center gap-10 pr-10">
          {[...items, ...items].map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-3 whitespace-nowrap font-display text-xl uppercase tracking-wide text-white/40"
            >
              {item}
              <span className="h-1.5 w-1.5 rounded-full bg-neon/60" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
