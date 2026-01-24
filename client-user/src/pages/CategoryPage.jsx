import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import CategorySidebar from "../components/CategorySidebar";
import ProductSection from "../components/ProductSection";
import { fetchUserCategories } from "../services/categoryApi";
import { getSections } from "../services/sectionApi";

const CategoryPage = () => {
  const { slug } = useParams();
  const [categories, setCategories] = useState([]);
  const [section, setSection] = useState(null);
  const activeCategory = categories.find((cat) => cat.slug === slug);

  const reorderedCategories = (() => {
    if (!categories.length) return [];

    const active = categories.find((cat) => cat.slug === slug);
    const rest = categories.filter((cat) => cat.slug !== slug);

    return active ? [active, ...rest] : categories;
  })();

  useEffect(() => {
    loadData();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  const loadData = async () => {
    const catRes = await fetchUserCategories();
    setCategories(catRes.data || []);

    const secRes = await getSections();
    const matched = secRes.find((s) => s.category?.slug === slug);
    setSection(matched);
  };

  if (!section) return <p className="p-6">Loading...</p>;

  return (
    <div
      className="
    max-w-[1400px]
    mx-auto
    px-3
    pt-10
    pb-6
    flex
    flex-col
    lg:flex-row
    gap-4
  "
    >
      {/* LEFT SIDEBAR */}
      <CategorySidebar
        categories={reorderedCategories}
        activeSlug={slug}
        variant="responsive"
      />

      {/* RIGHT CONTENT */}
      <div className="flex-1">
        {/* CATEGORY TITLE (TOP) */}
        {activeCategory && (
          <div className="bg-white sticky top-0 z-20 px-2 py-3 border-b">
            <h1 className="text-xl font-bold">{activeCategory.name}</h1>
          </div>
        )}

        <ProductSection
          products={section.products}
          categoryId={slug}
          layout="grid"
          showSeeAll={false}
        />
      </div>
    </div>
  );
};

export default CategoryPage;
