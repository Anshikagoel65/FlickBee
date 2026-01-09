import { useEffect, useState } from "react";
import { fetchUserCategories } from "../services/categoryApi";

const CategoryGrid = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await fetchUserCategories();
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

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
            className="flex flex-col items-center cursor-pointer"
          >
            {/* FULL IMAGE TILE */}
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
              <img
                src={`http://localhost:5000${cat.image}`}
                alt={cat.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Label */}
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
