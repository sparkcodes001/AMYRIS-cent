import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, SplitText } from "../../lib/gsapConfig";
import { PiArrowRightLight } from "react-icons/pi";
import FloatingParticles from "../../components/ui/FloatingParticles";
import Button from "../../components/ui/Button";
import storyVideo from "../../assets/videos/pvid.mp4";

const chapters = [
  { numeral: "I", eyebrow: "The Origin", title: "Born From Light" },
  { numeral: "II", eyebrow: "The Process", title: "Aged In Silence" },
  { numeral: "III", eyebrow: "The Reveal", title: "Released To The World" },
];

const stats = [
  { value: 200, suffix: "+", label: "Hours of Distillation" },
  { value: 15, suffix: "", label: "Rare Botanicals" },
  { value: 1, suffix: "", label: "Unmistakable Signature" },
];

export default function BrandStory() {
  const pinRef = useRef(null);
  const numeralRefs = useRef([]);
  const chapterRefs = useRef([]);
  const eyebrowRefs = useRef([]);
  const lineLeftRefs = useRef([]);
  const lineRightRefs = useRef([]);
  const statsRowRef = useRef(null);
  const statValueRefs = useRef([]);

  const mediaSectionRef = useRef(null);
  const mediaClipRef = useRef(null);
  const videoRef = useRef(null);
  const quoteRef = useRef(null);
  const quoteMarkRef = useRef(null);
  const ctaWrapRef = useRef(null);

  useGSAP(() => {
    const splits = chapterRefs.current.map(
      (el) => new SplitText(el, { type: "chars" }),
    );

    splits.forEach((split) => {
      gsap.set(split.chars, {
        opacity: 0,
        rotateX: -100,
        scale: 0.7,
        transformOrigin: "50% 100%",
      });
    });

    gsap.set(eyebrowRefs.current, { opacity: 0, y: 16 });
    gsap.set([...lineLeftRefs.current, ...lineRightRefs.current], {
      scaleX: 0,
    });
    gsap.set(numeralRefs.current, { opacity: 0 });
    gsap.set(statsRowRef.current, { opacity: 0, y: 30 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: pinRef.current,
        start: "top top",
        end: "+=280%",
        scrub: 0.6,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    const chapterInDuration = 10;
    const holdDuration = 8;
    const chapterOutDuration = 6;
    const gap = 2;
    let cursor = 0;

    splits.forEach((split, i) => {
      const isLast = i === splits.length - 1;

      tl.to(
        numeralRefs.current[i],
        { opacity: 1, duration: chapterInDuration },
        cursor,
      );
      tl.to(
        lineLeftRefs.current[i],
        { scaleX: 1, duration: chapterInDuration * 0.6, ease: "power2.out" },
        cursor,
      );
      tl.to(
        lineRightRefs.current[i],
        { scaleX: 1, duration: chapterInDuration * 0.6, ease: "power2.out" },
        cursor,
      );
      tl.to(
        eyebrowRefs.current[i],
        {
          opacity: 1,
          y: 0,
          duration: chapterInDuration * 0.6,
          ease: "power2.out",
        },
        cursor,
      );

      tl.to(
        split.chars,
        {
          opacity: 1,
          rotateX: 0,
          scale: 1,
          stagger: 0.025,
          duration: chapterInDuration,
          ease: "back.out(1.6)",
        },
        cursor,
      );

      cursor += chapterInDuration + holdDuration;

      if (!isLast) {
        tl.to(
          split.chars,
          {
            opacity: 0,
            rotateX: 100,
            scale: 0.7,
            filter: "blur(6px)",
            stagger: 0.015,
            duration: chapterOutDuration,
            ease: "power2.in",
          },
          cursor,
        );
        tl.to(
          numeralRefs.current[i],
          { opacity: 0, duration: chapterOutDuration },
          cursor,
        );
        tl.to(
          eyebrowRefs.current[i],
          { opacity: 0, duration: chapterOutDuration * 0.6 },
          cursor,
        );

        cursor += chapterOutDuration - gap;
      } else {
        tl.to(
          split.chars,
          {
            yPercent: -12,
            scale: 0.9,
            duration: chapterOutDuration,
            ease: "power2.out",
          },
          cursor,
        );
        tl.to(
          numeralRefs.current[i],
          { opacity: 0.4, duration: chapterOutDuration },
          cursor,
        );

        cursor += chapterOutDuration;

        tl.to(
          statsRowRef.current,
          { opacity: 1, y: 0, duration: 10, ease: "power2.out" },
          cursor,
        );

        statValueRefs.current.forEach((el, si) => {
          const target = { val: 0 };
          tl.to(
            target,
            {
              val: stats[si].value,
              duration: 14,
              ease: "power1.out",
              onUpdate: () => {
                el.textContent = Math.round(target.val);
              },
            },
            cursor,
          );
        });
      }
    });

    // ─── Curtain-reveal video + pull quote ───
    gsap.set(mediaClipRef.current, { clipPath: "inset(0% 0% 100% 0%)" });
    gsap.set(videoRef.current, { scale: 1.3 });

    gsap.to(mediaClipRef.current, {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 1.4,
      ease: "power4.inOut",
      scrollTrigger: {
        trigger: mediaSectionRef.current,
        start: "top 70%",
        onEnter: () => {
          // Ensure playback actually starts once the curtain begins lifting
          videoRef.current?.play().catch(() => {});
        },
      },
    });

    gsap.to(videoRef.current, {
      scale: 1,
      ease: "none",
      scrollTrigger: {
        trigger: mediaSectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.6,
      },
    });

    const quoteSplit = new SplitText(quoteRef.current, {
      type: "lines",
      mask: "lines",
    });

    gsap.set(quoteSplit.lines, { yPercent: 110, opacity: 0 });
    gsap.set(quoteMarkRef.current, { opacity: 0, scale: 0.5, rotate: -15 });
    gsap.set(ctaWrapRef.current, { opacity: 0, y: 20 });

    const quoteTl = gsap.timeline({
      scrollTrigger: {
        trigger: quoteRef.current,
        start: "top 80%",
      },
    });

    quoteTl
      .to(quoteMarkRef.current, {
        opacity: 1,
        scale: 1,
        rotate: 0,
        duration: 0.8,
        ease: "back.out(2)",
      })
      .to(
        quoteSplit.lines,
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.9,
          ease: "power3.out",
        },
        "-=0.4",
      )
      .to(
        ctaWrapRef.current,
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
        "-=0.3",
      );

    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, {});

  return (
    <>
      <section
        ref={pinRef}
        className="relative h-screen w-full overflow-hidden bg-amyris-black"
      >
        <FloatingParticles count={26} />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,162,75,0.08)_0%,transparent_60%)]" />

        {/* Chapters — flex-centered against the FULL screen height, always true dead-center regardless of what else is in this section */}
        <div className="relative z-10 flex h-full w-full items-center justify-center px-6 sm:px-10">
          <div className="relative w-full max-w-5xl">
            {chapters.map((chapter, i) => (
              <div
                key={chapter.numeral}
                className="absolute inset-0 flex flex-col items-center justify-center text-center"
                style={{ perspective: "1200px" }}
              >
                <span
                  ref={(el) => (numeralRefs.current[i] = el)}
                  className="text-outline pointer-events-none absolute -z-10 select-none font-display text-[32vw] leading-none sm:text-[28vw] lg:text-[22vw]"
                >
                  {chapter.numeral}
                </span>

                <div className="mb-4 flex items-center gap-3 sm:mb-6 sm:gap-4">
                  <span
                    ref={(el) => (lineLeftRefs.current[i] = el)}
                    className="h-[1px] w-6 origin-left bg-amyris-gold sm:w-10"
                  />
                  <p
                    ref={(el) => (eyebrowRefs.current[i] = el)}
                    className="whitespace-nowrap font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-amyris-gold-light sm:text-xs sm:tracking-[0.35em]"
                  >
                    {chapter.eyebrow}
                  </p>
                  <span
                    ref={(el) => (lineRightRefs.current[i] = el)}
                    className="h-[1px] w-6 origin-right bg-amyris-gold sm:w-10"
                  />
                </div>

                <h2
                  ref={(el) => (chapterRefs.current[i] = el)}
                  className="text-glow font-display font-medium text-amyris-cream text-[clamp(1.9rem,7vmin,5.5rem)] leading-[1.1]"
                >
                  {chapter.title}
                </h2>
              </div>
            ))}
          </div>
        </div>

        {/*
    Stats — pinned near the bottom edge with a FIXED offset (never %),
    so it always resolves correctly no matter the parent's box model.
    Always a tight horizontal row, even on mobile — just scaled down.
  */}
        <div
          ref={statsRowRef}
          className="absolute inset-x-0 bottom-6 z-10 mx-auto flex w-full max-w-3xl items-start justify-center gap-5 px-6 sm:bottom-10 sm:gap-10 md:bottom-14 md:gap-16"
        >
          {stats.map((stat, i) => (
            <div key={stat.label} className="w-20 text-center sm:w-auto">
              <p className="font-display text-xl text-amyris-gold-light sm:text-3xl md:text-5xl">
                <span ref={(el) => (statValueRefs.current[i] = el)}>0</span>
                {stat.suffix}
              </p>
              <p className="mt-1 font-sans text-[7px] uppercase leading-tight tracking-[0.15em] text-amyris-cream/50 sm:mt-2 sm:text-[10px] sm:tracking-[0.25em] md:text-xs">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        ref={mediaSectionRef}
        className="relative w-full bg-amyris-black py-24 sm:py-32 md:py-40"
      >
        <div className="mx-auto max-w-6xl px-6 sm:px-10 md:px-14">
          <div
            ref={mediaClipRef}
            className="relative aspect-[16/9] w-full overflow-hidden rounded-xl sm:aspect-[21/9]"
          >
            <video
              ref={videoRef}
              src={storyVideo}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          </div>

          <div className="mx-auto mt-16 max-w-3xl text-center sm:mt-20">
            <span
              ref={quoteMarkRef}
              className="mb-4 block font-display text-6xl text-amyris-gold sm:text-7xl"
            >
              "
            </span>

            <p
              ref={quoteRef}
              className="font-display text-[clamp(1.5rem,3.2vw,2.5rem)] font-medium italic leading-[1.35] text-amyris-cream"
            >
              We do not manufacture fragrance. We give light a form worth
              remembering.
            </p>

            <div ref={ctaWrapRef} className="mt-10 flex justify-center">
              <Button>
                Explore Our Craftsmanship
                <PiArrowRightLight
                  size={16}
                  className="transition-transform duration-500 group-hover:translate-x-1"
                />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
