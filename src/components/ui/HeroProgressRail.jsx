export default function HeroProgressRail({ containerRef, dotRef }) {
  return (
    <div
      ref={containerRef}
      className="absolute right-8 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center gap-4 opacity-0 md:flex lg:right-14"
    >
      <span className="font-sans text-xs tracking-widest text-amyris-cream/50">
        01
      </span>

      <div className="relative h-40 w-[1px] bg-amyris-cream/20">
        <div
          ref={dotRef}
          style={{ top: 0 }}
          className="absolute left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amyris-gold shadow-[0_0_10px_rgba(201,162,75,0.8)]"
        />
      </div>

      <span className="font-sans text-xs tracking-widest text-amyris-cream/50">
        05
      </span>
    </div>
  );
}
