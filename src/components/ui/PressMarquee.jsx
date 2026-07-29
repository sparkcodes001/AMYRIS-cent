import pressLogos from "../../data/pressLogos";

export default function PressMarquee() {
  // Duplicate the list so the loop is seamless (translateX(-50%) lines up perfectly)
  const items = [...pressLogos, ...pressLogos];

  return (
    <div className="relative w-full overflow-hidden border-y border-amyris-cream/10 py-8">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-amyris-black to-transparent sm:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-amyris-black to-transparent sm:w-32" />

      <div className="animate-marquee flex w-max gap-16 sm:gap-24">
        {items.map((name, i) => (
          <span
            key={i}
            className="whitespace-nowrap font-display text-xl tracking-[0.15em] text-amyris-cream/30 sm:text-2xl"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
