import { useState, useLayoutEffect, useRef, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { gsap, Flip } from "../lib/gsapConfig";
import ShopHero from "../components/shop/ShopHero";
import FilterBar from "../components/shop/FilterBar";
import ShopGrid from "../components/shop/ShopGrid";
import products from "../data/products";

const categories = ["all", ...new Set(products.map((p) => p.family))];

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A–Z" },
];

const comparators = {
  featured: (a, b) => Number(b.isBestseller) - Number(a.isBestseller),
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  "name-asc": (a, b) => a.name.localeCompare(b.name),
};

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get("category") || "all";
  const sort = searchParams.get("sort") || "featured";

  const flipStateRef = useRef(null);
  const isFirstRender = useRef(true);

  // Called from FilterBar handlers — captures FLIP state SYNCHRONOUSLY,
  // before setSearchParams triggers the re-render that changes the DOM.
  const updateParams = (next) => {
    flipStateRef.current = Flip.getState("[data-flip-id]");

    const params = new URLSearchParams(searchParams);
    Object.entries(next).forEach(([key, value]) => {
      const isDefault =
        (key === "category" && value === "all") ||
        (key === "sort" && value === "featured");
      if (value && !isDefault) params.set(key, value);
      else params.delete(key);
    });
    setSearchParams(params, { replace: true });
  };

  // Fires after React has committed the new filter/sort to the DOM —
  // animates every surviving card from its captured old position.
  useLayoutEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!flipStateRef.current) return;

    Flip.from(flipStateRef.current, {
      duration: 0.65,
      ease: "power3.inOut",
      stagger: 0.035,
      absolute: true,
      onEnter: (els) =>
        gsap.fromTo(
          els,
          { opacity: 0, scale: 0.85 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.05,
            ease: "power2.out",
          },
        ),
      onLeave: (els) =>
        gsap.to(els, {
          opacity: 0,
          scale: 0.85,
          duration: 0.35,
          ease: "power2.in",
        }),
    });

    flipStateRef.current = null;
  }, [category, sort]);

  const orderedProducts = useMemo(() => {
    const list = [...products];
    list.sort(comparators[sort] || comparators.featured);
    return list;
  }, [sort]);

  const visibleCount = orderedProducts.filter(
    (p) => category === "all" || p.family === category,
  ).length;

  return (
    <main className="bg-amyris-black">
      <ShopHero totalCount={products.length} />

      <FilterBar
        categories={categories}
        activeCategory={category}
        onCategoryChange={(val) => updateParams({ category: val, sort })}
        sort={sort}
        sortOptions={sortOptions}
        onSortChange={(val) => updateParams({ category, sort: val })}
        visibleCount={visibleCount}
        totalCount={products.length}
      />

      <ShopGrid products={orderedProducts} category={category} />
    </main>
  );
}
