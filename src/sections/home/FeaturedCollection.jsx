import { useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, SplitText } from "../../lib/gsapConfig";
import { PiArrowRightLight } from "react-icons/pi";
import ProductCard from "../../components/ui/ProductCard";
import Button from "../../components/ui/Button";
import products from "../../data/products";

export default function FeaturedCollection() {
  const sectionRef = useRef(null);
  const eyebrowRef = useRef(null);
  const headingRef = useRef(null);
  const lineRef = useRef(null);
  const linkRef = useRef(null);
  const gridRef = useRef(null);

  useGSAP(
    () => {
      const headingSplit = new SplitText(headingRef.current, {
        type: "lines",
        mask: "lines",
      });

      gsap.set(eyebrowRef.current, { opacity: 0, y: 16 });
      gsap.set(headingSplit.lines, { yPercent: 110 });
      gsap.set(lineRef.current, { scaleX: 0 });
      gsap.set(linkRef.current, { opacity: 0, y: 16 });

      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });

      headerTl
        .to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" })
        .to(lineRef.current, { scaleX: 1, duration: 0.8, ease: "power2.out" }, "-=0.5")
        .to(
          headingSplit.lines,
          { yPercent: 0, duration: 0.9, stagger: 0.1, ease: "power3.out" },
          "-=0.6"
        )
        .to(linkRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.4");

      // Cards: staggered rise + fade as they enter viewport
      const cards = gridRef.current.querySelectorAll("[data-card-reveal]");

      gsap.set(cards, { opacity: 0, y: 60 });

      gsap.to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 85%",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-amyris-black px-6 py-24 sm:px-10 md:px-14 md:py-32 lg:px-20"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
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

        {/* Product grid */}
        <div
          ref={gridRef}
          className="mt-14 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 md:mt-20 lg:grid-cols-4"
        >
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
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