import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

const Button = forwardRef(function Button(
  { children, className = "", as: Component = "button", ...props },
  ref,
) {
  return (
    <Component
      ref={ref}
      className={twMerge(
        "group relative inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap border border-amyris-gold/70 px-7 py-3.5 font-sans text-[10px] font-medium uppercase tracking-[0.25em] text-amyris-cream transition-colors duration-500 hover:text-amyris-black sm:gap-3 sm:px-9 sm:py-4 sm:text-[11px] sm:tracking-[0.3em]",
        className,
      )}
      {...props}
    >
      <span className="absolute inset-0 -z-10 -translate-x-full bg-amyris-gold transition-transform duration-500 ease-out group-hover:translate-x-0" />
      <span className="relative z-10 inline-flex items-center gap-2 sm:gap-3">
        {children}
      </span>
    </Component>
  );
});

export default Button;
