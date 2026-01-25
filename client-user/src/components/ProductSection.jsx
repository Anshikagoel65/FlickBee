import { useRef, useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProductSection = ({
  title,
  products,
  categorySlug,
  layout = "carousel",
  showSeeAll = true,
}) => {
  const sliderRef = useRef(null);

  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const navigate = useNavigate();

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

  if (!Array.isArray(products) || products.length === 0) {
    return null;
  }

  const handleSeeAll = () => {
    if (!categorySlug) return;
    navigate(`/category/${categorySlug}`);
  };

  return (
    <section
      id={categorySlug}
      className={`relative ${layout === "grid" ? "mt-4" : "mt-10"}`}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-3xl font-bold">{title}</h2>

        {showSeeAll && (
          <button
            onClick={handleSeeAll}
            className="text-green-600 text-xl font-medium"
          >
            see all
          </button>
        )}
      </div>

      {layout === "grid" ? (
        <div
          className="
    grid
    gap-x-3
    gap-y-4
    justify-center
    [grid-template-columns:repeat(auto-fill,250px)]
  "
        >
          {products.map((product) => (
            <ProductCard key={product._id} product={product} variant="grid" />
          ))}
        </div>
      ) : (
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
              <ProductCard
                key={product._id}
                product={product}
                variant="carousel"
              />
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
      )}
    </section>
  );
};

export default ProductSection;
