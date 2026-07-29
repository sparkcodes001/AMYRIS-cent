import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "../../lib/gsapConfig";
import { PiArrowRightLight, PiCheckBold } from "react-icons/pi";
import Button from "../../components/ui/Button";
import newsletterVideo from "../../assets/videos/newsletter-bg.mp4";

export default function Newsletter() {
  const sectionRef = useRef(null);
  const eyebrowRef = useRef(null);
  const headingRef = useRef(null);
  const subRef = useRef(null);
  const formRef = useRef(null);
  const underlineRef = useRef(null);
  const successRef = useRef(null);

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useGSAP(
    () => {
      const headingSplit = new SplitText(headingRef.current, {
        type: "lines",
        mask: "lines",
      });

      gsap.set(eyebrowRef.current, { opacity: 0, y: 16 });
      gsap.set(headingSplit.lines, { yPercent: 110 });
      gsap.set(subRef.current, { opacity: 0, y: 16 });
      gsap.set(formRef.current, { opacity: 0, y: 16 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });

      tl.to(eyebrowRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
      })
        .to(
          headingSplit.lines,
          { yPercent: 0, duration: 0.9, stagger: 0.1, ease: "power3.out" },
          "-=0.5",
        )
        .to(
          subRef.current,
          { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
          "-=0.5",
        )
        .to(
          formRef.current,
          { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
          "-=0.5",
        );
    },
    { scope: sectionRef },
  );

  const handleFocus = () => {
    gsap.to(underlineRef.current, {
      scaleX: 1,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  const handleBlur = () => {
    if (!email) {
      gsap.to(underlineRef.current, {
        scaleX: 0,
        duration: 0.4,
        ease: "power2.in",
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    setSubmitted(true);

    gsap.to(formRef.current, {
      opacity: 0,
      y: -10,
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => {
        gsap.set(formRef.current, { display: "none" });
        gsap.set(successRef.current, { display: "flex" });
        gsap.fromTo(
          successRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        );
      },
    });
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-amyris-black px-6 py-28 sm:px-10 md:py-36"
    >
      {/* ─── Video background ─── */}
      <video
        src={newsletterVideo}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/*
        ─── Legibility overlays ───
        Flat wash: darkens the whole clip uniformly so text always has contrast.
        Radial: extra darkness concentrated behind the text/form column.
        Edge fades: melt the video's hard rectangle into the pure-black
        sections above/below, so there's no visible seam.

        Tuning tip: if your footage (e.g. a candle) is naturally very dark,
        drop the flat wash to bg-black/35–40 so the motion still reads.
        If it's brighter (e.g. mist in strong light), keep it around /55–60.
      */}
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(10,9,8,0.75)_0%,rgba(10,9,8,0.35)_55%,rgba(10,9,8,0.7)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-amyris-black to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-amyris-black to-transparent" />

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <p
          ref={eyebrowRef}
          className="mb-5 font-sans text-xs font-medium uppercase tracking-[0.35em] text-amyris-gold"
        >
          Stay In The Light
        </p>

        <h2
          ref={headingRef}
          className="font-display font-medium text-amyris-cream text-[clamp(2rem,5vw,3.5rem)] leading-[1.15]"
        >
          Be First to Know
        </h2>

        <p
          ref={subRef}
          className="mx-auto mt-5 max-w-md font-sans text-sm leading-relaxed text-amyris-cream/60 sm:text-base"
        >
          Join our circle for early access to new fragrances, private
          collections, and stories from the atelier.
        </p>

        {/* Form */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="mx-auto mt-10 flex max-w-md flex-col items-center gap-6 sm:mt-12"
        >
          <div className="relative w-full">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="Enter your email address"
              className="w-full border-b border-amyris-cream/20 bg-transparent px-1 py-3 text-center font-sans text-sm text-amyris-cream placeholder:text-amyris-cream/30 focus:outline-none sm:text-base"
            />
            <span
              ref={underlineRef}
              className="absolute bottom-0 left-0 h-[1px] w-full origin-center scale-x-0 bg-amyris-gold"
            />
          </div>

          <Button as="button" type="submit" className="px-10">
            Subscribe
            <PiArrowRightLight size={16} />
          </Button>
        </form>

        {/* Success state (hidden until submit) */}
        <div
          ref={successRef}
          style={{ display: "none" }}
          className="mx-auto mt-10 flex max-w-md flex-col items-center gap-4 sm:mt-12"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-amyris-gold text-amyris-gold-light">
            <PiCheckBold size={20} />
          </span>
          <p className="font-sans text-sm text-amyris-cream/70">
            Thank you — welcome to the circle.
          </p>
        </div>

        <p className="mt-8 font-sans text-[10px] uppercase tracking-[0.25em] text-amyris-cream/25">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
