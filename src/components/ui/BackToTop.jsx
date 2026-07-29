import { useRef } from "react";
import { gsap } from "../../lib/gsapConfig";
import { PiArrowUpLight } from "react-icons/pi";

export default function BackToTop() {
  const circleRef = useRef(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEnter = () => {
    gsap.to(circleRef.current, {
      rotate: 360,
      duration: 0.6,
      ease: "power2.out",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      onMouseEnter={handleEnter}
      aria-label="Back to top"
      className="group flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-amyris-gold/40 text-amyris-gold-light transition-colors duration-300 hover:border-amyris-gold hover:bg-amyris-gold hover:text-amyris-black"
    >
      <span ref={circleRef} className="inline-flex">
        <PiArrowUpLight size={20} />
      </span>
    </button>
  );
}
