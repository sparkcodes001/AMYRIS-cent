import ProductCard from "../ui/ProductCard";

export default function ShopGrid({ products, category }) {
  const isVisible = (product) =>
    category === "all" || product.family === category;
  const hasVisible = products.some(isVisible);

  return (
    <section className="px-6 pb-24 pt-12 sm:px-10 md:px-14 md:pb-32 lg:px-20">
      <div className="mx-auto max-w-7xl">
        {!hasVisible && (
          <div className="flex flex-col items-center justify-center gap-3 py-32 text-center">
            <p className="font-display text-2xl text-amyris-cream/70">
              No fragrances match this filter — yet.
            </p>
            <p className="font-sans text-sm text-amyris-cream/40">
              Explore another family, or view the full collection.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, i) => (
            <div
              key={product.id}
              data-flip-id={product.id}
              className={isVisible(product) ? "" : "hidden"}
            >
              <ProductCard product={product} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
