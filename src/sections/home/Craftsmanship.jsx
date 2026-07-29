import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "../../lib/gsapConfig";
import craftSteps from "../../data/craftSteps";

export default function Craftsmanship() {
  const pinRef = useRef(null);
  const trackRef = useRef(null);
  const bgWordRef = useRef(null);
  const progressFillRef = useRef(null);
  const cardImageRefs = useRef([]);
  const cardContentRefs = useRef([]);

  useGSAP(
    () => {
      const track = trackRef.current;

      // Function-based distance calc — re-evaluated automatically by GSAP
      // on every ScrollTrigger.refresh() thanks to invalidateOnRefresh.
      // No rAF needed, no async gap, no risk of duplicate builds.
      const getDistance = () => track.scrollWidth - window.innerWidth;

      gsap.set(cardImageRefs.current, { scale: 1.2 });
      gsap.set(cardContentRefs.current, { opacity: 0, y: 50 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: () => `+=${getDistance() + window.innerHeight * 0.6}`,
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Horizontal track movement — function-based x, recalculated on refresh
      tl.to(
        track,
        {
          x: () => -getDistance(),
          ease: "none",
          duration: 100,
          onUpdate: function () {
            if (progressFillRef.current) {
              progressFillRef.current.style.width = `${this.progress() * 100}%`;
            }
          },
        },
        0,
      );

      // Parallax background word — also function-based for the same reason
      tl.to(
        bgWordRef.current,
        { x: () => -getDistance() * 0.35, ease: "none", duration: 100 },
        0,
      );

      // Each card settles in during its own window
      const n = craftSteps.length;
      craftSteps.forEach((_, i) => {
        const windowStart = (i / n) * 100 * 0.85;
        const windowDuration = (100 / n) * 1.3;

        tl.to(
          cardImageRefs.current[i],
          { scale: 1, ease: "power2.out", duration: windowDuration },
          windowStart,
        );
        tl.to(
          cardContentRefs.current[i],
          {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            duration: windowDuration * 0.8,
          },
          windowStart + windowDuration * 0.15,
        );
      });
    },
    { scope: pinRef },
  );

  return (
    <section
      ref={pinRef}
      className="relative h-screen w-full overflow-hidden bg-amyris-black"
    >
      <span
        ref={bgWordRef}
        className="text-outline pointer-events-none absolute top-1/2 left-[10%] -translate-y-1/2 select-none whitespace-nowrap font-display text-[18vw] leading-none"
      >
        CRAFTSMANSHIP
      </span>

      <div className="absolute left-6 top-8 z-20 sm:left-10 sm:top-10 md:left-14">
        <p className="font-sans text-xs font-medium uppercase tracking-[0.35em] text-amyris-gold">
          The Art
        </p>
        <h2 className="mt-3 font-display text-2xl text-amyris-cream sm:text-3xl">
          Crafted, Not Manufactured
        </h2>
      </div>

      <div className="relative z-10 flex h-full items-center">
        <div
          ref={trackRef}
          className="flex gap-6 px-6 will-change-transform sm:gap-10 sm:px-10 md:gap-14 md:px-14"
        >
          {craftSteps.map((step, i) => (
            <div
              key={step.number}
              className="relative w-[78vw] shrink-0 sm:w-[48vw] md:w-[36vw] lg:w-[30vw]"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm">
                <img
                  ref={(el) => (cardImageRefs.current[i] = el)}
                  src={step.image}
                  alt={step.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <span className="absolute left-5 top-5 font-display text-4xl text-amyris-gold-light/80 sm:text-5xl">
                  {step.number}
                </span>
              </div>

              <div
                ref={(el) => (cardContentRefs.current[i] = el)}
                className="mt-6"
              >
                <h3 className="font-display text-2xl text-amyris-cream sm:text-3xl">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-sm font-sans text-sm leading-relaxed text-amyris-cream/60">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-x-6 bottom-8 z-20 sm:inset-x-10 md:inset-x-14">
        <div className="h-[1px] w-full bg-amyris-cream/15">
          <div ref={progressFillRef} className="h-full w-0 bg-amyris-gold" />
        </div>
        <div className="mt-3 flex justify-between font-sans text-[10px] uppercase tracking-[0.3em] text-amyris-cream/40">
          <span>Scroll to Explore</span>
          <span>01 — 04</span>
        </div>
      </div>
    </section>
  );
}
