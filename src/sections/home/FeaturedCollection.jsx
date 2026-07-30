import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, SplitText } from "../../lib/gsapConfig";
import { PiArrowRightLight } from "react-icons/pi";
import ProductCard from "../../components/ui/ProductCard";
import Button from "../../components/ui/Button";
import products from "../../data/products";

// Deduplicated fragrance notes across the collection — drives the ambient
// marquee strip below the grid using real product data instead of filler copy.
const noteWords = [...new Set(products.flatMap((p) => p.notes.split(" · ")))];

export default function FeaturedCollection() {
  const sectionRef = useRef(null);
  const watermarkRef = useRef(null);
  const eyebrowRef = useRef(null);
  const headingRef = useRef(null);
  const lineRef = useRef(null);
  const linkRef = useRef(null);
  const trackRef = useRef(null);
  const cardWrapRefs = useRef([]);

  const [activeIndex, setActiveIndex] = useState(0);

  // ─── Live "active card" tracking for the mobile carousel counter ───
  // Pure IntersectionObserver — no scroll-position math, no GSAP ticking.
  // Works natively alongside the browser's own scroll-snap engine.
  useEffect(() => {
    const container = trackRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (mostVisible) {
          setActiveIndex(Number(mostVisible.target.dataset.index));
        }
      },
      { root: container, threshold: [0.5, 0.75, 1] },
    );

    cardWrapRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const headingSplit = new SplitText(headingRef.current, {
        type: "lines",
        mask: "lines",
      });

      const cards = gsap.utils.toArray(
        "[data-card-reveal]",
        sectionRef.current,
      );

      // ─── Reduced-motion users skip straight to the resting state ───
      if (prefersReducedMotion) {
        gsap.set(headingSplit.lines, {
          yPercent: 0,
          opacity: 1,
          filter: "blur(0px)",
        });
        gsap.set([eyebrowRef.current, linkRef.current], { opacity: 1, y: 0 });
        gsap.set(lineRef.current, { scaleX: 1 });
        gsap.set(watermarkRef.current, { opacity: 1, scale: 1 });
        gsap.set(cards, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(watermarkRef.current, { opacity: 0, scale: 0.94 });
      gsap.set(eyebrowRef.current, { opacity: 0, y: 16 });
      gsap.set(headingSplit.lines, {
        yPercent: 110,
        opacity: 0,
        filter: "blur(6px)",
      });
      gsap.set(lineRef.current, { scaleX: 0 });
      gsap.set(linkRef.current, { opacity: 0, y: 16 });
      gsap.set(cards, { opacity: 0, y: 60 });

      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });

      headerTl
        .to(
          watermarkRef.current,
          { opacity: 1, scale: 1, duration: 1.3, ease: "power2.out" },
          0,
        )
        .to(
          eyebrowRef.current,
          { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
          0.15,
        )
        .to(
          lineRef.current,
          { scaleX: 1, duration: 0.8, ease: "power2.out" },
          "-=0.5",
        )
        .to(
          headingSplit.lines,
          {
            yPercent: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.9,
            stagger: 0.1,
            ease: "power3.out",
          },
          "-=0.6",
        )
        .to(
          linkRef.current,
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          "-=0.4",
        );

      // ─── Per-card reveal via ScrollTrigger.batch ───
      // Each card animates the moment IT enters view — scales correctly
      // once this grid grows beyond 4 items (pagination, filters, etc).
      ScrollTrigger.batch(cards, {
        start: "top 88%",
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: "power3.out",
            overwrite: true,
          }),
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-amyris-black px-6 py-24 sm:px-10 md:px-14 md:py-32 lg:px-20"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="relative flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
          {/* Ghost watermark — echoes the numeral treatment from BrandStory,
              giving the section typographic depth without a new pattern */}
          <span
            ref={watermarkRef}
            aria-hidden="true"
            className="text-outline pointer-events-none absolute -left-2 -top-10 -z-10 select-none whitespace-nowrap font-display text-[22vw] leading-none sm:-top-16 sm:text-[14vw] lg:-top-20 lg:text-[9vw]"
          >
            Collection
          </span>

          <div>
            <p
              ref={eyebrowRef}
              className="mb-5 font-sans text-xs font-medium uppercase tracking-[0.35em] text-amyris-gold"
            >
              The Collection
            </p>

            <h2
              ref={headingRef}
              className="font-display font-medium text-amyris-cream text-[clamp(2rem,5vw,3.75rem)] leading-[1.1]"
            >
              Signature Scents
            </h2>

            <span
              ref={lineRef}
              className="mt-6 block h-[1px] w-24 origin-left bg-amyris-gold"
            />
          </div>

          <Link
            ref={linkRef}
            to="/shop"
            className="group hidden items-center gap-2 font-sans text-xs font-medium uppercase tracking-[0.25em] text-amyris-cream/70 transition-colors duration-300 hover:text-amyris-cream sm:flex"
          >
            View All Fragrances
            <PiArrowRightLight
              size={16}
              className="transition-transform duration-500 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/*
          Product rail — a single set of DOM nodes that behaves as:
            • a native horizontal scroll-snap carousel below `lg`
            • a static 4-column grid at `lg` and above
          No duplicated markup, no duplicated GSAP targets, no duplicated
          IntersectionObserver entries — CSS alone decides the layout mode.
        */}
        <div className="relative mt-14 md:mt-20">
          {/* Edge fades hint at more content off-screen on mobile/tablet */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-amyris-black to-transparent lg:hidden" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-amyris-black to-transparent lg:hidden" />

          <div
            ref={trackRef}
            role="region"
            aria-label="Signature scents"
            className="no-scrollbar flex snap-x snap-mandatory gap-x-6 overflow-x-auto scroll-px-6 px-6 pb-2 lg:grid lg:snap-none lg:grid-cols-4 lg:gap-x-8 lg:gap-y-16 lg:overflow-visible lg:px-0 lg:pb-0"
          >
            {products.map((product, i) => (
              <div
                key={product.id}
                ref={(el) => (cardWrapRefs.current[i] = el)}
                data-index={i}
                className="w-[80%] shrink-0 snap-start sm:w-[45%] lg:w-auto lg:snap-align-none"
              >
                <ProductCard product={product} index={i} />
              </div>
            ))}
          </div>

          {/* Mobile-only live counter + progress indicator */}
          <div className="mt-8 flex items-center gap-4 px-6 lg:hidden">
            <span className="font-sans text-xs tracking-[0.2em] text-amyris-gold-light">
              {String(activeIndex + 1).padStart(2, "0")}
            </span>
            <div className="relative h-[2px] flex-1 overflow-hidden rounded-full bg-amyris-cream/10">
              <div
                className="h-full rounded-full bg-amyris-gold transition-[width] duration-500 ease-out"
                style={{
                  width: `${((activeIndex + 1) / products.length) * 100}%`,
                }}
              />
            </div>
            <span className="font-sans text-xs tracking-[0.2em] text-amyris-cream/40">
              {String(products.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Ambient notes marquee — real product data, not filler copy */}
        <div className="mt-16 overflow-hidden border-y border-amyris-cream/10 py-4 md:mt-24">
          <div className="animate-feature-marquee flex w-max gap-10 whitespace-nowrap">
            {[...noteWords, ...noteWords].map((note, i) => (
              <span
                key={i}
                className="font-sans text-[11px] uppercase tracking-[0.3em] text-amyris-cream/35"
              >
                {note}
              </span>
            ))}
          </div>
        </div>

        {/* Mobile-only CTA */}
        <div className="mt-14 flex justify-center sm:hidden">
          <Button as={Link} to="/shop">
            View All Fragrances
            <PiArrowRightLight size={16} />
          </Button>
        </div>
      </div>
    </section>
  );
}
