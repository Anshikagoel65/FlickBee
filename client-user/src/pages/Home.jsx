import { useEffect, useState } from "react";
import HeroBanners from "../components/HeroBanners";
import CategoryGrid from "../components/CategoryGrid";
import ProductSection from "../components/ProductSection";
import { getSections } from "../services/sectionApi";

const Home = () => {
  const [sections, setSections] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null); // ✅ MOVED INSIDE

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      const data = await getSections();
      setSections(data);
    } catch (err) {
      console.error("Failed to load sections", err);
    }
  };

  // ✅ Optional: auto-scroll like Blinkit
  useEffect(() => {
    if (activeCategory) {
      const el = document.getElementById(activeCategory);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeCategory]);

  return (
    <main className="w-full">
      <div className="max-w-[1400px] mx-auto px-6 py-6">
        <HeroBanners />

        {/* CATEGORY CLICK */}
        <CategoryGrid onCategorySelect={setActiveCategory} />

        {/* PRODUCTS */}
        {sections
          .filter((sec) => {
            if (!sec?.category || !sec?.products?.length) return false;
            if (!activeCategory) return true; // show all
            return sec.category.slug === activeCategory;
          })
          .map((sec) => (
            <ProductSection
              key={sec._id}
              title={sec.category.name}
              products={sec.products}
              categoryId={sec.category.slug}
            />
          ))}
      </div>
    </main>
  );
};

export default Home;
