import { useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "../../lib/gsapConfig";
import { PiInstagramLogo, PiTiktokLogo, PiFacebookLogo } from "react-icons/pi";
import FloatingParticles from "../ui/FloatingParticles";
import BackToTop from "../ui/BackToTop";
import useLocalTime from "../../hooks/useLocalTime";

const shopLinks = [
  { to: "/shop", label: "All Fragrances" },
  { to: "/shop", label: "Best Sellers" },
  { to: "/shop", label: "New Arrivals" },
  { to: "/shop", label: "Gift Sets" },
];

const brandLinks = [
  { to: "/about", label: "Our Story" },
  { to: "/the-art", label: "The Art" },
  { to: "/journal", label: "Journal" },
  { to: "/contact", label: "Contact" },
];

const locations = [
  { city: "New York", tz: "America/New_York" },
  { city: "Paris", tz: "Europe/Paris" },
  { city: "Dubai", tz: "Asia/Dubai" },
];

function LocationRow({ city, tz }) {
  const time = useLocalTime(tz);
  return (
    <li className="flex items-center justify-between font-sans text-sm text-amyris-cream/60">
      <span>{city}</span>
      <span className="font-display italic text-amyris-gold-light/80">
        {time}
      </span>
    </li>
  );
}

export default function Footer() {
  const footerRef = useRef(null);
  const wordmarkRef = useRef(null);

  useGSAP(
    () => {
      const split = new SplitText(wordmarkRef.current, { type: "chars" });

      gsap.set(split.chars, { yPercent: 100, opacity: 0 });

      gsap.to(split.chars, {
        yPercent: 0,
        opacity: 1,
        stagger: 0.02,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 85%",
        },
      });
    },
    { scope: footerRef },
  );

  return (
    <footer
      ref={footerRef}
      className="relative w-full overflow-hidden border-t border-amyris-cream/10 bg-amyris-black px-6 pt-16 sm:px-10 md:px-14"
    >
      <FloatingParticles count={12} />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* ─── Top: CTA row ─── */}
        <div className="flex flex-col items-start justify-between gap-8 border-b border-amyris-cream/10 pb-14 sm:flex-row sm:items-end">
          <div>
            <p className="mb-4 font-sans text-xs font-medium uppercase tracking-[0.35em] text-amyris-gold">
              Ready When You Are
            </p>
            <Link
              to="/shop"
              className="font-display text-[clamp(1.75rem,4vw,3rem)] leading-tight text-amyris-cream transition-colors duration-500 hover:text-amyris-gold-light"
            >
              Begin Your Signature Scent →
            </Link>
          </div>

          <BackToTop />
        </div>

        {/* ─── Middle: link columns ─── */}
        <div className="grid grid-cols-1 gap-12 py-14 sm:grid-cols-2 md:grid-cols-4">
          <div className="sm:col-span-2 md:col-span-1">
            <p className="max-w-xs font-sans text-sm leading-relaxed text-amyris-cream/50">
              Where light becomes fragrance. Crafted in silence, worn in
              confidence.
            </p>

            <div className="mt-6 flex gap-4">
              {[PiInstagramLogo, PiTiktokLogo, PiFacebookLogo].map(
                (Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-amyris-cream/15 text-amyris-cream/50 transition-all duration-300 hover:-translate-y-1 hover:border-amyris-gold hover:text-amyris-gold-light"
                  >
                    <Icon size={16} />
                  </a>
                ),
              )}
            </div>
          </div>

          <div>
            <p className="mb-5 font-sans text-xs font-medium uppercase tracking-[0.25em] text-amyris-cream/40">
              Shop
            </p>
            <ul className="flex flex-col gap-3">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="link-underline font-sans text-sm text-amyris-cream/70 transition-colors duration-300 hover:text-amyris-gold-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-5 font-sans text-xs font-medium uppercase tracking-[0.25em] text-amyris-cream/40">
              The Brand
            </p>
            <ul className="flex flex-col gap-3">
              {brandLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="link-underline font-sans text-sm text-amyris-cream/70 transition-colors duration-300 hover:text-amyris-gold-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-5 font-sans text-xs font-medium uppercase tracking-[0.25em] text-amyris-cream/40">
              Our Ateliers
            </p>
            <ul className="flex flex-col gap-3">
              {locations.map((loc) => (
                <LocationRow key={loc.city} {...loc} />
              ))}
            </ul>
          </div>
        </div>

        {/* ─── Giant kinetic wordmark ─── */}
        <div className="overflow-hidden border-t border-amyris-cream/10 py-6">
          <h2
            ref={wordmarkRef}
            className="text-outline select-none text-center font-display leading-none text-[16vw] sm:text-[14vw] md:text-[12vw]"
          >
            AMYRIS
          </h2>
        </div>

        {/* ─── Bottom bar ─── */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-amyris-cream/10 py-8 sm:flex-row">
          <p className="font-sans text-xs tracking-widest text-amyris-cream/40">
            © {new Date().getFullYear()} AMYRIS — All Rights Reserved
          </p>
          <div className="flex gap-6 font-sans text-xs tracking-widest text-amyris-cream/40">
            <Link to="/" className="transition-colors hover:text-amyris-cream">
              Privacy Policy
            </Link>
            <Link to="/" className="transition-colors hover:text-amyris-cream">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
