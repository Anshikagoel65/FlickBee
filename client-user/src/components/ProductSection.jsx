import { useRef, useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ProductSection = ({ title, products }) => {
  const sliderRef = useRef(null);

  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const updateArrows = () => {
    const el = sliderRef.current;
    if (!el) return;

    setShowLeft(el.scrollLeft > 0);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  const scrollLeft = () => {
    sliderRef.current.scrollBy({
      left: -sliderRef.current.clientWidth,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    sliderRef.current.scrollBy({
      left: sliderRef.current.clientWidth,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    updateArrows();
  }, [products]);

  // 🔴 SAFETY: don’t render empty sections
  if (!products || products.length === 0) return null;

  return (
    <section className="mt-10 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold">{title}</h2>
        <button className="text-green-600 text-xl font-medium">see all</button>
      </div>

      {/* Carousel */}
      <div className="relative">
        {showLeft && (
          <button
            onClick={scrollLeft}
            className="absolute left-1 sm:-left-4 top-1/2 -translate-y-1/2
              z-10 w-8 h-8 bg-white border rounded-full shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        <div
          ref={sliderRef}
          onScroll={updateArrows}
          className="flex gap-4 overflow-x-auto overflow-y-hidden scroll-smooth scrollbar-hide"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {showRight && (
          <button
            onClick={scrollRight}
            className="absolute right-1 sm:-right-4 top-1/2 -translate-y-1/2
              z-10 w-8 h-8 bg-white border rounded-full shadow-sm"
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    </section>
  );
};

export default ProductSection;
