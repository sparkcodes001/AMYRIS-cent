import { PiCaretDownLight } from "react-icons/pi";

export default function FilterBar({
  categories,
  activeCategory,
  onCategoryChange,
  sort,
  sortOptions,
  onSortChange,
  visibleCount,
  totalCount,
}) {
  return (
    <div className="sticky top-16 z-30 border-y border-amyris-cream/10 bg-amyris-black/90 backdrop-blur-md md:top-24">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-10 md:px-14 lg:px-20">
        {/* Category pills — horizontally scrollable on mobile, never wraps ugly */}
        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 sm:flex-wrap">
          {categories.map((cat) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                aria-pressed={active}
                className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 font-sans text-[11px] font-medium uppercase tracking-[0.2em] transition-colors duration-300 ${
                  active
                    ? "border-amyris-gold bg-amyris-gold text-amyris-black"
                    : "border-amyris-cream/20 text-amyris-cream/60 hover:border-amyris-gold/50 hover:text-amyris-cream"
                }`}
              >
                {cat === "all" ? "All" : cat}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <p
            aria-live="polite"
            className="whitespace-nowrap font-sans text-[11px] uppercase tracking-[0.2em] text-amyris-cream/40"
          >
            {visibleCount} of {totalCount}
          </p>

          <div className="relative">
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value)}
              aria-label="Sort fragrances"
              className="cursor-pointer appearance-none rounded-full border border-amyris-cream/20 bg-transparent py-1.5 pl-4 pr-9 font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-amyris-cream transition-colors duration-300 hover:border-amyris-gold/50 focus:border-amyris-gold focus:outline-none"
            >
              {sortOptions.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  className="bg-amyris-black text-amyris-cream"
                >
                  {opt.label}
                </option>
              ))}
            </select>
            <PiCaretDownLight
              size={12}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-amyris-cream/50"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
