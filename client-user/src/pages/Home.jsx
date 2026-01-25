import { useEffect, useState } from "react";
import HeroBanners from "../components/HeroBanners";
import CategoryGrid from "../components/CategoryGrid";
import ProductSection from "../components/ProductSection";
import { getSections } from "../services/sectionApi";

const Home = () => {
  const [sections, setSections] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

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

  useEffect(() => {
    if (activeCategory) {
      const el = document.getElementById(activeCategory);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeCategory]);

  return (
    <main className="w-full pb-20 md:pb-0">
      <div className="max-w-[1400px] mx-auto px-6 py-6">
        <HeroBanners />
        <CategoryGrid onCategorySelect={setActiveCategory} />
        {sections
          .filter((sec) => {
            if (!sec?.category || !sec?.products?.length) return false;
            if (!activeCategory) return true;
            return sec.category.slug === activeCategory;
          })
          .map((sec) => (
            <ProductSection
              key={sec._id || sec.category.slug}
              title={sec.category.name}
              products={sec.products}
              categorySlug={sec.category.slug}
              layout="carousel"
              showSeeAll={true}
            />
          ))}
      </div>
    </main>
  );
};

export default Home;
