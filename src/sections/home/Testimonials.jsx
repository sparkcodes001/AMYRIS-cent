import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "../../lib/gsapConfig";
import StarRating from "../../components/ui/StarRating";
import PressMarquee from "../../components/ui/PressMarquee";
import testimonials from "../../data/testimonials";

export default function Testimonials() {
  const pinRef = useRef(null);
  const quoteMarkRef = useRef(null);
  const quoteRefs = useRef([]);
  const ratingRefs = useRef([]);
  const nameRefs = useRef([]);
  const roleRefs = useRef([]);
  const dotRefs = useRef([]);

  useGSAP(
    () => {
      const n = testimonials.length;

      gsap.set(
        [quoteRefs.current, ratingRefs.current, nameRefs.current, roleRefs.current].flat(),
        { opacity: 0, y: 24 }
      );
      gsap.set(
        [quoteRefs.current[0], ratingRefs.current[0], nameRefs.current[0], roleRefs.current[0]],
        { opacity: 1, y: 0 }
      );

      gsap.set(dotRefs.current, { scale: 1, backgroundColor: "rgba(255,255,255,0.15)" });
      gsap.set(dotRefs.current[0], { scale: 1.3, backgroundColor: "#c9a24b" });

      gsap.set(quoteMarkRef.current, { opacity: 0, scale: 0.6, rotate: -10 });
      gsap.to(quoteMarkRef.current, {
        opacity: 1,
        scale: 1,
        rotate: 0,
        duration: 0.8,
        ease: "back.out(2)",
        scrollTrigger: { trigger: pinRef.current, start: "top 70%" },
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: `+=${window.innerHeight * (n - 1) * 0.9}`,
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      const segment = 100 / (n - 1 || 1);

      testimonials.forEach((_, i) => {
        if (i === 0) return;
        const start = (i - 1) * segment;
        const dur = segment * 0.5;

        tl.to(
          [
            quoteRefs.current[i - 1],
            ratingRefs.current[i - 1],
            nameRefs.current[i - 1],
            roleRefs.current[i - 1],
          ],
          { opacity: 0, y: -20, duration: dur * 0.7 },
          start
        );

        tl.to(
          [
            quoteRefs.current[i],
            ratingRefs.current[i],
            nameRefs.current[i],
            roleRefs.current[i],
          ],
          { opacity: 1, y: 0, duration: dur, ease: "power2.out" },
          start + dur * 0.3
        );

        tl.to(
          dotRefs.current[i - 1],
          { scale: 1, backgroundColor: "rgba(255,255,255,0.15)", duration: dur },
          start
        );
        tl.to(
          dotRefs.current[i],
          { scale: 1.3, backgroundColor: "#c9a24b", duration: dur },
          start
        );
      });
    },
    { scope: pinRef }
  );

  return (
    <>
      <section
        ref={pinRef}
        className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-amyris-black px-6 sm:px-10"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,162,75,0.06)_0%,transparent_65%)]" />

        <p className="mb-6 font-sans text-xs font-medium uppercase tracking-[0.35em] text-amyris-gold sm:mb-8">
          What They Say
        </p>

        <span
          ref={quoteMarkRef}
          className="mb-2 block font-display text-6xl leading-none text-amyris-gold sm:text-7xl"
        >
          "
        </span>

        <div className="relative w-full max-w-3xl">
          <div className="relative min-h-[9rem] text-center sm:min-h-[7.5rem]">
            {testimonials.map((t, i) => (
              <p
                key={i}
                ref={(el) => (quoteRefs.current[i] = el)}
                className="absolute inset-x-0 font-display text-[clamp(1.25rem,3vw,2rem)] font-medium italic leading-[1.4] text-amyris-cream"
              >
                {t.quote}
              </p>
            ))}
          </div>

          <div className="relative mt-8 flex h-6 items-center justify-center sm:mt-10">
            {testimonials.map((t, i) => (
              <div
                key={i}
                ref={(el) => (ratingRefs.current[i] = el)}
                className="absolute"
              >
                <StarRating count={t.rating} />
              </div>
            ))}
          </div>

          <div className="relative mt-5 h-6">
            {testimonials.map((t, i) => (
              <p
                key={i}
                ref={(el) => (nameRefs.current[i] = el)}
                className="absolute inset-x-0 text-center font-sans text-sm font-medium text-amyris-cream"
              >
                {t.name}
              </p>
            ))}
          </div>

          <div className="relative mt-1 h-5">
            {testimonials.map((t, i) => (
              <p
                key={i}
                ref={(el) => (roleRefs.current[i] = el)}
                className="absolute inset-x-0 text-center font-sans text-xs uppercase tracking-[0.25em] text-amyris-cream/40"
              >
                {t.role}
              </p>
            ))}
          </div>
        </div>

        {/* Progress dots */}
        <div className="mt-12 flex gap-3 sm:mt-16">
          {testimonials.map((_, i) => (
            <span
              key={i}
              ref={(el) => (dotRefs.current[i] = el)}
              className="h-1.5 w-1.5 rounded-full"
            />
          ))}
        </div>
      </section>

      {/* Non-pinned: press credibility marquee */}
      <div className="w-full bg-amyris-black py-4">
        <p className="mb-6 text-center font-sans text-[10px] uppercase tracking-[0.35em] text-amyris-cream/30">
          As Featured In
        </p>
        <PressMarquee />
      </div>
    </>
  );
}