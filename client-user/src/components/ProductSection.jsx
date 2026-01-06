import { useRef, useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getProducts } from "../services/productApi";

const ProductSection = () => {
  const sliderRef = useRef(null);

  const [products, setProducts] = useState([]);
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
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  useEffect(() => {
    updateArrows();
  }, [products]);

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
              flex items-center justify-center
              absolute left-1 sm:-left-4
              top-1/2 -translate-y-1/2
              z-10
              w-8 h-8 sm:w-8 sm:h-8
              bg-white border rounded-full shadow-sm
              hover:scale-105 transition
            "
          >
            <ChevronLeft size={20} className="sm:hidden" />
            <ChevronLeft size={22} className="hidden sm:block" />
          </button>
        )}

        {/* Cards */}
        <div
          ref={sliderRef}
          onScroll={updateArrows}
          className="
            flex gap-4
            overflow-x-auto overflow-y-hidden
            scroll-smooth
            scrollbar-hide
          "
        >
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* RIGHT ARROW */}
        {showRight && (
          <button
            onClick={scrollRight}
            className="
              flex items-center justify-center
              absolute right-1 sm:-right-4
              top-1/2 -translate-y-1/2
              z-10
              w-8 h-8 sm:w-8 sm:h-8
              bg-white border rounded-full shadow-sm
              hover:scale-105 transition
            "
          >
            <ChevronRight size={20} className="sm:hidden" />
            <ChevronRight size={22} className="hidden sm:block" />
          </button>
        )}
      </div>
    </section>
  );
};

export default ProductSection;
