import { useEffect, useState } from "react";
import { fetchUserCategories } from "../services/categoryApi";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000";

const CategoryGrid = ({ onCategorySelect }) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ define function BEFORE useEffect
  const loadCategories = async () => {
    try {
      const res = await fetchUserCategories();
      setCategories(res.data || []);
    } catch (err) {
      console.error("Failed to load categories", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  /* 🔄 LOADING STATE */
  if (loading) {
    return <p className="mt-6 text-gray-500">Loading categories…</p>;
  }

  /* 🚫 EMPTY STATE */
  if (categories.length === 0) {
    return <p className="mt-6 text-gray-500">No categories available</p>;
  }

  return (
    <section className="mt-6">
      <div
        className="
          grid
          grid-cols-4
          sm:grid-cols-6
          md:grid-cols-8
          lg:grid-cols-10
          gap-4
        "
      >
        {categories.map((cat) => (
          <div
            key={cat._id}
            onClick={() => navigate(`/category/${cat.slug}`)}
            className="flex flex-col items-center cursor-pointer"
          >
            {/* IMAGE TILE */}
            <div
              className="
                w-20 h-20
                sm:w-24 sm:h-24
                rounded-2xl
                overflow-hidden
                bg-gray-100
                hover:scale-105
                transition
              "
            >
              {cat.image ? (
                <img
                  src={`${API_BASE}${cat.image}`}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/placeholder.png";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                  No Image
                </div>
              )}
            </div>

            {/* LABEL */}
            <p className="mt-2 text-sm sm:text-base text-center font-medium text-gray-800 leading-tight">
              {cat.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
