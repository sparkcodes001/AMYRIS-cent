// src/components/layout/Navbar.jsx
import { useRef, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { gsap } from "../../lib/gsapConfig";
import {
  PiListLight,
  PiXLight,
  PiBagSimpleLight,
  PiMagnifyingGlassLight,
} from "react-icons/pi";

const links = [
  { to: "/shop", label: "Collection" },
  { to: "/about", label: "About" },
  { to: "/the-art", label: "The Art" },
  { to: "/journal", label: "Journal" },
];

export default function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount] = useState(0); // swap with useContext(CartContext) when ready

  const headerRef = useRef(null);
  const accentLineRef = useRef(null);
  const menuRef = useRef(null);
  const menuBgRef = useRef(null);
  const menuLinksRef = useRef([]);
  const menuFooterRef = useRef(null);
  const closeRef = useRef(null);

  // Hover-follower dot for desktop nav
  const dotRef = useRef(null);
  const navRef = useRef(null);

  // ─── Scroll-aware header state ───
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ─── Gold accent underline draws in when scrolled ───
  useEffect(() => {
    gsap.to(accentLineRef.current, {
      scaleX: scrolled ? 1 : 0,
      duration: 0.6,
      ease: "power2.out",
    });
  }, [scrolled]);

  // ─── Desktop nav: sliding gold dot follower ───
  const handleNavEnter = (e) => {
    const dot = dotRef.current;
    const nav = navRef.current;
    if (!dot || !nav) return;

    const linkRect = e.currentTarget.getBoundingClientRect();
    const navRect = nav.getBoundingClientRect();

    gsap.to(dot, {
      x: linkRect.left - navRect.left + linkRect.width / 2 - 3,
      opacity: 1,
      duration: 0.35,
      ease: "power2.out",
    });
  };

  const handleNavLeave = () => {
    gsap.to(dotRef.current, { opacity: 0, duration: 0.25 });
  };

  // ─── Mobile menu: GSAP-orchestrated open / close ───
  // Runs imperatively (not via useGSAP) because it's trigger-driven,
  // not mount-driven — we want full control over timeline direction.
  const menuTlRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });

      tl.set(menuRef.current, { display: "flex" })
        .to(menuBgRef.current, {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.7,
          ease: "power4.inOut",
        })
        .to(
          closeRef.current,
          { opacity: 1, rotate: 0, duration: 0.4, ease: "back.out(2)" },
          "-=0.2",
        )
        .to(
          menuLinksRef.current,
          {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.5,
            ease: "power3.out",
          },
          "-=0.2",
        )
        .to(
          menuFooterRef.current,
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
          "-=0.2",
        );

      menuTlRef.current = tl;
    }, menuRef);

    return () => ctx.revert();
  }, []);

  // Initial hidden states for menu children
  useEffect(() => {
    gsap.set(menuBgRef.current, { clipPath: "inset(0% 0% 100% 0%)" });
    gsap.set(closeRef.current, { opacity: 0, rotate: -45 });
    gsap.set(menuLinksRef.current, { opacity: 0, y: 40 });
    gsap.set(menuFooterRef.current, { opacity: 0, y: 20 });
    gsap.set(menuRef.current, { display: "none" });
  }, []);

  const openMenu = () => {
    setOpen(true);
    menuTlRef.current?.play();
    document.body.style.overflow = "hidden";
  };

  const closeMenu = () => {
    menuTlRef.current?.reverse().then(() => {
      setOpen(false);
      gsap.set(menuRef.current, { display: "none" });
      document.body.style.overflow = "";
    });
  };

  // Close on route change
  useEffect(() => {
    if (open) closeMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && open) closeMenu();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <>
      {/* ─── Main header bar ─── */}
      <header
        ref={headerRef}
        className={`fixed left-0 top-0 z-50 w-full transition-colors duration-500`}
      >
        <div className="relative flex w-full items-center justify-between px-6 py-5 sm:px-8 md:px-14 md:py-6">
          {/* Logo — mix-blend-difference isolated to the wordmark only */}
          <Link
            to="/"
            className="relative z-10 font-display text-xl tracking-[0.2em] text-amyris-cream mix-blend-difference sm:text-2xl"
            aria-label="Amyris — home"
          >
            AMYRIS
          </Link>

          {/* Desktop nav with sliding gold dot follower */}
          <nav
            ref={navRef}
            className="relative hidden gap-10 lg:flex"
            aria-label="Main navigation"
            onMouseLeave={handleNavLeave}
          >
            {/* Follower dot */}
            <span
              ref={dotRef}
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-2 h-[3px] w-[3px] rounded-full bg-amyris-gold opacity-0"
            />

            {links.map((link) => {
              const active = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onMouseEnter={handleNavEnter}
                  className={`relative font-sans text-xs font-medium uppercase tracking-[0.25em] transition-colors duration-300 ${
                    active
                      ? "text-amyris-gold-light"
                      : "text-amyris-cream hover:text-amyris-gold-light"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                  {/* Active route underline */}
                  {active && (
                    <span className="absolute -bottom-1.5 left-0 h-[1px] w-full bg-amyris-gold/60" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop actions */}
          <div className="hidden items-center gap-7 md:flex">
            <button
              aria-label="Search"
              className="text-amyris-cream/70 transition-colors duration-300 hover:text-amyris-gold-light"
            >
              <PiMagnifyingGlassLight size={20} />
            </button>

            <button
              aria-label={`Cart — ${cartCount} item${cartCount !== 1 ? "s" : ""}`}
              className="relative text-amyris-cream/70 transition-colors duration-300 hover:text-amyris-gold-light"
            >
              <PiBagSimpleLight size={20} />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-amyris-gold font-sans text-[9px] font-medium text-amyris-black">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={openMenu}
            aria-label="Open navigation menu"
            aria-expanded={open}
            className="relative z-10 text-amyris-cream lg:hidden"
          >
            <PiListLight size={26} />
          </button>
        </div>

        {/* Gold accent underline — draws in from left once scrolled
        <div className="px-6 sm:px-8 md:px-14">
          <span
            ref={accentLineRef}
            aria-hidden="true"
            className="block h-[1px] w-full origin-left scale-x-0 bg-gradient-to-r from-amyris-gold/60 via-amyris-gold/20 to-transparent"
          />
        </div> */}
      </header>

      {/* ─── Mobile fullscreen menu ─── */}
      <div
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className="fixed inset-0 z-[60] hidden flex-col items-center justify-center"
      >
        {/* Animated background — clips up from bottom */}
        <div
          ref={menuBgRef}
          className="absolute inset-0 bg-amyris-black"
          style={{ clipPath: "inset(0% 0% 100% 0%)" }}
        />

        {/* Grain texture overlay — same as rest of site */}
        <div className="grain-overlay absolute inset-0 opacity-[0.04]" />

        {/* Radial gold glow — matches BrandStory ambient style */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,162,75,0.07)_0%,transparent_65%)]" />

        {/* Close button */}
        <button
          ref={closeRef}
          onClick={closeMenu}
          aria-label="Close navigation menu"
          className="absolute right-6 top-5 text-amyris-cream sm:right-8 sm:top-6"
        >
          <PiXLight size={28} />
        </button>

        {/* Logo — stays visible in the menu too */}
        <span className="absolute left-6 top-5 font-display text-xl tracking-[0.2em] text-amyris-cream sm:left-8 sm:top-6 sm:text-2xl">
          AMYRIS
        </span>

        {/* Nav links — staggered in from below */}
        <nav
          className="relative z-10 flex flex-col items-center gap-6 sm:gap-8"
          aria-label="Mobile navigation"
        >
          {links.map((link, i) => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                ref={(el) => (menuLinksRef.current[i] = el)}
                onClick={closeMenu}
                className={`group relative font-display text-4xl tracking-widest sm:text-5xl ${
                  active ? "text-amyris-gold-light" : "text-amyris-cream"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {/* Animated underline on hover */}
                <span className="absolute -bottom-1 left-0 h-[1px] w-full origin-left scale-x-0 bg-amyris-gold transition-transform duration-500 ease-out group-hover:scale-x-100" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Menu footer — actions + small print */}
        <div
          ref={menuFooterRef}
          className="absolute inset-x-0 bottom-10 z-10 flex flex-col items-center gap-6 px-6"
        >
          <div className="flex gap-10 font-sans text-xs font-medium uppercase tracking-[0.25em] text-amyris-cream/60">
            <button
              className="flex items-center gap-2 transition-colors hover:text-amyris-cream"
              aria-label="Search"
            >
              <PiMagnifyingGlassLight size={16} />
              Search
            </button>
            <button
              className="flex items-center gap-2 transition-colors hover:text-amyris-cream"
              aria-label="Cart"
            >
              <PiBagSimpleLight size={16} />
              Cart
              {cartCount > 0 && (
                <span className="ml-1 font-medium text-amyris-gold">
                  ({cartCount})
                </span>
              )}
            </button>
          </div>

          <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-amyris-cream/20">
            © {new Date().getFullYear()} Amyris
          </p>
        </div>
      </div>
    </>
  );
}
