import {
  PiLeafDuotone,
  PiFlaskDuotone,
  PiDiamondDuotone,
} from "react-icons/pi";

const features = [
  {
    icon: PiLeafDuotone,
    title: "Finest Ingredients",
    desc: "Sourced from around the world",
  },
  {
    icon: PiFlaskDuotone,
    title: "Expertly Crafted",
    desc: "By masters of perfumery",
  },
  {
    icon: PiDiamondDuotone,
    title: "Timeless Elegance",
    desc: "Designed to leave a lasting impression",
  },
];

export default function HeroFeatureBar({ innerRef }) {
  return (
    <div
      ref={innerRef}
      className="mx-auto w-full max-w-5xl rounded-2xl border border-amyris-gold/20 bg-black/40 px-3 py-4 backdrop-blur-sm sm:px-8 sm:py-5 md:px-10 md:py-6"
    >
      {/* Always 3 columns — never stacks, just scales down */}
      <div className="grid grid-cols-3 divide-x divide-amyris-gold/15">
        {features.map(({ icon: Icon, title, desc }, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-1.5 px-1.5 text-center sm:flex-row sm:items-center sm:gap-4 sm:px-4 sm:text-left md:px-6"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-amyris-gold/40 text-amyris-gold-light sm:h-9 sm:w-9 md:h-11 md:w-11">
              <Icon size={14} className="sm:hidden" />
              <Icon size={18} className="hidden sm:block md:hidden" />
              <Icon size={20} className="hidden md:block" />
            </span>

            <div>
              <p className="font-sans text-[9px] font-medium uppercase leading-tight tracking-[0.08em] text-amyris-cream sm:text-xs sm:tracking-[0.15em]">
                {title}
              </p>
              {/* Description hidden on the smallest screens — no room for
                  three full sentences side-by-side at that width */}
              <p className="mt-0.5 hidden font-sans text-[10px] text-amyris-cream/50 sm:block sm:text-xs">
                {desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
