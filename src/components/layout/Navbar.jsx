import { useState } from "react";
import { Link } from "react-router-dom";
import { PiListLight, PiXLight } from "react-icons/pi";

const links = [
  { to: "/shop", label: "Collection" },
  { to: "/about", label: "About" },
  { to: "/the-art", label: "The Art" },
  { to: "/journal", label: "Journal" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 z-50 flex w-full items-center justify-between px-6 py-5 mix-blend-difference text-amyris-cream sm:px-8 md:px-14 md:py-6">
        <Link
          to="/"
          className="font-display text-xl tracking-[0.2em] text-amyris-cream sm:text-2xl"
        >
          AMYRIS
        </Link>

        <nav className="hidden gap-10 font-sans text-xs font-medium uppercase tracking-[0.25em] lg:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="transition-opacity hover:opacity-60"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden gap-8 font-sans text-xs font-medium uppercase tracking-[0.25em] md:flex">
          <button className="transition-opacity hover:opacity-60">
            Search
          </button>
          <button className="transition-opacity hover:opacity-60">
            Cart (0)
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setOpen(true)}
          className="lg:hidden"
          aria-label="Open menu"
        >
          <PiListLight size={26} />
        </button>
      </header>

      {/* Mobile fullscreen menu */}
      <div
        className={`fixed inset-0 z-[60] flex flex-col items-center justify-center gap-8 bg-amyris-black transition-opacity duration-500 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute top-5 right-6 text-amyris-cream sm:top-6 sm:right-8"
          aria-label="Close menu"
        >
          <PiXLight size={28} />
        </button>

        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            onClick={() => setOpen(false)}
            className="font-display text-3xl tracking-widest text-amyris-cream transition-opacity hover:opacity-60"
          >
            {link.label}
          </Link>
        ))}

        <div className="mt-6 flex gap-8 font-sans text-xs font-medium uppercase tracking-[0.25em] text-amyris-cream/70">
          <button>Search</button>
          <button>Cart (0)</button>
        </div>
      </div>
    </>
  );
}
