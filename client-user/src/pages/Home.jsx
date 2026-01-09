import { useEffect, useState } from "react";
import HeroBanners from "../components/HeroBanners";
import CategoryGrid from "../components/CategoryGrid";
import ProductSection from "../components/ProductSection";
import { getSections } from "../services/sectionApi";

const Home = () => {
  const [sections, setSections] = useState([]);

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

  return (
    <main className="w-full">
      <div className="max-w-[1400px] mx-auto px-6 py-6">
        <HeroBanners />
        <CategoryGrid />

        {sections.map((sec) => (
          <ProductSection
            key={sec.category._id}
            title={sec.category.name}
            products={sec.products}
          />
        ))}
      </div>
    </main>
  );
};

export default Home;
