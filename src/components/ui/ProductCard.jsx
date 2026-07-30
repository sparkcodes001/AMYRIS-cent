import { useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "../../lib/gsapConfig";
import { PiArrowUpRightLight } from "react-icons/pi";

export default function ProductCard({ product, index }) {
  const cardRef = useRef(null);
  const imageRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = ((y - rect.height / 2) / rect.height) * -8;
    const rotateY = ((x - rect.width / 2) / rect.width) * 8;

    gsap.to(card, {
      rotateX,
      rotateY,
      duration: 0.5,
      ease: "power2.out",
      transformPerspective: 800,
    });

    gsap.to(imageRef.current, {
      x: (x - rect.width / 2) * 0.03,
      y: (y - rect.height / 2) * 0.03,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.7,
      ease: "elastic.out(1, 0.5)",
    });
    gsap.to(imageRef.current, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: "elastic.out(1, 0.5)",
    });
  };

  return (
    <Link
      to={`/shop/${product.id}`}
      data-card-reveal
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative block [transform-style:preserve-3d]"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-b from-amyris-cream/[0.04] to-transparent">
        <img
          ref={imageRef}
          src={product.image}
          alt={product.name}
          className="h-full w-full scale-105 object-cover transition-transform duration-700 ease-out group-hover:scale-115"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <span className="absolute right-4 top-4 flex h-10 w-10 -translate-y-2 items-center justify-center rounded-full border border-amyris-gold/50 text-amyris-gold-light opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <PiArrowUpRightLight size={18} />
        </span>

        {product.isNew ? (
          <span className="absolute left-4 top-4 rounded-full bg-amyris-gold px-2.5 py-1 font-sans text-[9px] font-medium uppercase tracking-[0.15em] text-amyris-black">
            New
          </span>
        ) : (
          <span className="absolute left-4 top-4 font-sans text-[10px] tracking-[0.3em] text-amyris-cream/40">
            0{index + 1}
          </span>
        )}
      </div>

      <div className="mt-5 flex items-start justify-between">
        <div>
          <h3 className="font-display text-lg text-amyris-cream sm:text-xl">
            {product.name}
          </h3>
          <p className="mt-1 font-sans text-xs text-amyris-cream/50">
            {product.notes}
          </p>
          {product.family && (
            <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.2em] text-amyris-gold/60">
              {product.family}
            </p>
          )}
        </div>
        <p className="font-serif text-lg italic text-amyris-gold-light">
          ${product.price}
        </p>
      </div>

      <span className="mt-3 block h-[1px] w-full origin-left scale-x-[0.15] bg-amyris-gold/40 transition-transform duration-500 ease-out group-hover:scale-x-100" />
    </Link>
  );
}
