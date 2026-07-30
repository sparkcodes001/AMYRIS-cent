import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "../../lib/gsapConfig";
import FloatingParticles from "../ui/FloatingParticles";

export default function ShopHero({ totalCount }) {
  const sectionRef = useRef(null);
  const eyebrowRef = useRef(null);
  const headingRef = useRef(null);
  const descRef = useRef(null);
  const countRef = useRef(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const headingSplit = new SplitText(headingRef.current, {
        type: "lines",
        mask: "lines",
      });

      if (prefersReducedMotion) {
        gsap.set(headingSplit.lines, { yPercent: 0, opacity: 1 });
        gsap.set([eyebrowRef.current, descRef.current], { opacity: 1, y: 0 });
        if (countRef.current) countRef.current.textContent = totalCount;
        return;
      }

      gsap.set(eyebrowRef.current, { opacity: 0, y: 16 });
      gsap.set(headingSplit.lines, { yPercent: 110, opacity: 0 });
      gsap.set(descRef.current, { opacity: 0, y: 16 });

      const tl = gsap.timeline({ delay: 0.1 });

      tl.to(eyebrowRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
      })
        .to(
          headingSplit.lines,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.1,
            ease: "power3.out",
          },
          "-=0.5",
        )
        .to(
          descRef.current,
          { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
          "-=0.5",
        );

      if (countRef.current) {
        const target = { val: 0 };
        tl.to(
          target,
          {
            val: totalCount,
            duration: 1.2,
            ease: "power1.out",
            onUpdate: () => {
              countRef.current.textContent = Math.round(target.val);
            },
          },
          "-=0.6",
        );
      }
    },
    { scope: sectionRef, dependencies: [totalCount] },
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[65vh] w-full items-center justify-center overflow-hidden bg-amyris-black px-6 pt-28 sm:pt-32 md:min-h-[75vh] md:pt-40"
    >
      <FloatingParticles count={18} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,162,75,0.1)_0%,transparent_65%)]" />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <p
          ref={eyebrowRef}
          className="mb-5 font-sans text-xs font-medium uppercase tracking-[0.35em] text-amyris-gold"
        >
          The Full Collection
        </p>

        <h1
          ref={headingRef}
          className="break-normal font-display font-medium text-amyris-cream text-[clamp(2.25rem,7vw,5rem)] leading-[1.1]"
        >
          Every Scent Tells A Story
        </h1>

        <p
          ref={descRef}
          className="mx-auto mt-6 max-w-xl font-sans text-sm leading-relaxed text-amyris-cream/60 sm:text-base"
        >
          <span ref={countRef}>0</span> fragrances, each distilled from rare
          botanicals and aged in silence until ready to be discovered.
        </p>
      </div>
    </section>
  );
}
