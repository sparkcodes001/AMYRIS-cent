import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, SplitText } from "../../lib/gsapConfig";
import FloatingParticles from "../../components/ui/FloatingParticles";
import craftProcess from "../../data/craftProcess";

export default function TheAtelier() {
  const pinRef = useRef(null);
  const mediaRefs = useRef([]);
  const bigNumberRefs = useRef([]);
  const tagRefs = useRef([]);
  const titleRefs = useRef([]);
  const descRefs = useRef([]);
  const listLabelRefs = useRef([]);
  const listNumberRefs = useRef([]);
  const dotRefs = useRef([]);
  const verticalFillRef = useRef(null);

  useGSAP(
    () => {
      const n = craftProcess.length;

      // ─── Initial states ───
      gsap.set(mediaRefs.current, { opacity: 0 });
      gsap.set(mediaRefs.current[0], { opacity: 1 });

      gsap.set(bigNumberRefs.current, { opacity: 0 });
      gsap.set(bigNumberRefs.current[0], { opacity: 1 });

      gsap.set([tagRefs.current, titleRefs.current, descRefs.current].flat(), {
        opacity: 0,
        y: 24,
        filter: "blur(8px)",
      });
      gsap.set(
        [tagRefs.current[0], titleRefs.current[0], descRefs.current[0]],
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
        },
      );

      gsap.set(listLabelRefs.current, { opacity: 0.35 });
      gsap.set(listLabelRefs.current[0], { opacity: 1 });
      gsap.set(dotRefs.current, {
        scale: 1,
        backgroundColor: "rgba(255,255,255,0.2)",
      });
      gsap.set(dotRefs.current[0], { scale: 1.4, backgroundColor: "#c9a24b" });

      // Play the first video immediately if it's a video step
      if (craftProcess[0].type === "video") {
        mediaRefs.current[0]
          ?.querySelector("video")
          ?.play()
          .catch(() => {});
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: `+=${window.innerHeight * (n - 1) * 1.1}`,
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Overall vertical progress line fills across the WHOLE timeline
      tl.to(
        verticalFillRef.current,
        {
          height: "100%",
          ease: "none",
          duration: 100,
        },
        0,
      );

      const segment = 100 / (n - 1 || 1);

      craftProcess.forEach((step, i) => {
        if (i === 0) return; // step 0 is already the initial visible state
        const start = (i - 1) * segment;
        const fadeDuration = segment * 0.5;

        // Crossfade media
        tl.to(
          mediaRefs.current[i],
          { opacity: 1, duration: fadeDuration },
          start,
        );
        tl.to(
          mediaRefs.current[i - 1],
          { opacity: 0, duration: fadeDuration },
          start,
        );

        // Trigger video playback right as it fades in
        if (step.type === "video") {
          tl.call(
            () => {
              mediaRefs.current[i]
                ?.querySelector("video")
                ?.play()
                .catch(() => {});
            },
            null,
            start,
          );
        }

        // Ghost number crossfade
        tl.to(
          bigNumberRefs.current[i],
          { opacity: 1, duration: fadeDuration },
          start,
        );
        tl.to(
          bigNumberRefs.current[i - 1],
          { opacity: 0, duration: fadeDuration },
          start,
        );

        // Text content: blur/rise out old, blur/rise in new
        tl.to(
          [
            tagRefs.current[i - 1],
            titleRefs.current[i - 1],
            descRefs.current[i - 1],
          ],
          {
            opacity: 0,
            y: -20,
            filter: "blur(8px)",
            duration: fadeDuration * 0.7,
          },
          start,
        );
        tl.to(
          [tagRefs.current[i], titleRefs.current[i], descRefs.current[i]],
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: fadeDuration,
            ease: "power2.out",
          },
          start + fadeDuration * 0.3,
        );

        // Stepper list highlight
        tl.to(
          listLabelRefs.current[i - 1],
          { opacity: 0.35, duration: fadeDuration },
          start,
        );
        tl.to(
          listLabelRefs.current[i],
          { opacity: 1, duration: fadeDuration },
          start,
        );
        tl.to(
          dotRefs.current[i - 1],
          {
            scale: 1,
            backgroundColor: "rgba(255,255,255,0.2)",
            duration: fadeDuration,
          },
          start,
        );
        tl.to(
          dotRefs.current[i],
          { scale: 1.4, backgroundColor: "#c9a24b", duration: fadeDuration },
          start,
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
      <FloatingParticles count={14} />

      <div className="relative z-10 grid h-full grid-rows-[48%_52%] lg:grid-cols-[1.1fr_1fr] lg:grid-rows-1">
        {/* ─── LEFT / TOP: Sticky media panel ─── */}
        <div className="relative h-full w-full overflow-hidden">
          {craftProcess.map((step, i) => (
            <div
              key={i}
              ref={(el) => (mediaRefs.current[i] = el)}
              className="absolute inset-0"
            >
              {step.type === "video" ? (
                <video
                  src={step.src}
                  muted
                  loop
                  playsInline
                  preload="auto"
                  className="animate-kenburns h-full w-full object-cover"
                />
              ) : (
                <img
                  src={step.src}
                  alt={step.title}
                  className="animate-kenburns h-full w-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />
            </div>
          ))}

          {/* Frame accent */}
          <div className="pointer-events-none absolute inset-4 border border-amyris-gold/20 sm:inset-6" />

          {/* Ghost step number */}
          <div className="pointer-events-none absolute bottom-6 left-6 sm:bottom-8 sm:left-8">
            {craftProcess.map((step, i) => (
              <span
                key={i}
                ref={(el) => (bigNumberRefs.current[i] = el)}
                className="text-outline absolute bottom-0 left-0 select-none font-display text-7xl leading-none sm:text-8xl"
              >
                0{i + 1}
              </span>
            ))}
          </div>
        </div>

        {/* ─── RIGHT / BOTTOM: Narrative panel ─── */}
        <div className="relative flex h-full w-full flex-col justify-center px-6 py-8 sm:px-10 md:px-14 lg:px-16">
          <p className="mb-3 font-sans text-xs font-medium uppercase tracking-[0.35em] text-amyris-gold">
            The Atelier
          </p>
          <h2 className="mb-8 font-display text-2xl text-amyris-cream sm:text-3xl md:mb-12 md:text-4xl">
            Where Craft Becomes Ritual
          </h2>

          {/* Active step text — stacked, crossfading */}
          <div className="relative h-[9.5rem] sm:h-[8rem] md:h-[9rem]">
            {craftProcess.map((step, i) => (
              <div key={i} className="absolute inset-0">
                <p
                  ref={(el) => (tagRefs.current[i] = el)}
                  className="font-sans text-xs font-medium uppercase tracking-[0.3em] text-amyris-gold-light"
                >
                  {step.tag}
                </p>
                <h3
                  ref={(el) => (titleRefs.current[i] = el)}
                  className="mt-3 font-display text-xl text-amyris-cream sm:text-2xl md:text-3xl"
                >
                  {step.title}
                </h3>
                <p
                  ref={(el) => (descRefs.current[i] = el)}
                  className="mt-3 max-w-md font-sans text-sm leading-relaxed text-amyris-cream/60 sm:text-base"
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          {/* Vertical scrollspy stepper */}
          <div className="relative mt-10 flex flex-col gap-7 pl-8 sm:mt-14 sm:gap-9">
            <div className="absolute bottom-1 left-0 top-1 w-[1px] bg-amyris-cream/10">
              <div
                ref={verticalFillRef}
                className="w-full bg-amyris-gold"
                style={{ height: "0%" }}
              />
            </div>

            {craftProcess.map((step, i) => (
              <div key={i} className="relative flex items-center gap-4">
                <span
                  ref={(el) => (dotRefs.current[i] = el)}
                  className="absolute -left-8 h-2 w-2 shrink-0 -translate-x-1/2 rounded-full"
                />
                <span
                  ref={(el) => (listNumberRefs.current[i] = el)}
                  className="font-sans text-[10px] tracking-widest text-amyris-cream/30"
                >
                  0{i + 1}
                </span>
                <span
                  ref={(el) => (listLabelRefs.current[i] = el)}
                  className="font-sans text-sm text-amyris-cream sm:text-base"
                >
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
