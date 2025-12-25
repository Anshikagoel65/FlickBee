import { useRef, useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ProductSection = () => {
  const sliderRef = useRef(null);

  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

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
  }, []);

  return (
    <section className="mt-10 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Dairy, Bread & Eggs</h2>
        <button className="text-green-600 text-xl font-medium">see all</button>
      </div>

      {/* Carousel */}
      <div className="relative">
        {/* LEFT ARROW */}
        {showLeft && (
          <button
            onClick={scrollLeft}
            className="
              hidden md:flex
              items-center justify-center
              absolute -left-6
              top-1/2 -translate-y-1/2
              z-10
              w-12 h-12
              bg-white
              border
              rounded-full
              shadow-lg
            "
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* Cards */}
        <div
          ref={sliderRef}
          onScroll={updateArrows}
          className="flex gap-4 overflow-hidden scroll-smooth"
        >
          {Array.from({ length: 12 }).map((_, index) => (
            <ProductCard key={index} />
          ))}
        </div>

        {/* RIGHT ARROW */}
        {showRight && (
          <button
            onClick={scrollRight}
            className="
              hidden md:flex
              items-center justify-center
              absolute -right-6
              top-1/2 -translate-y-1/2
              z-10
              w-12 h-12
              bg-white
              border
              rounded-full
              shadow-lg
            "
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </section>
  );
};

export default ProductSection;
