const API_BASE = "http://localhost:5000";

const CategoryCard = ({ category }) => {
  const handleClick = () => {
    const el = document.getElementById(category.slug);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div
      onClick={handleClick}
      className="flex flex-col items-center cursor-pointer"
    >
      {/* IMAGE */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gray-100">
        {category.image ? (
          <img
            src={`${API_BASE}${category.image}`}
            alt={category.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
            No Image
          </div>
        )}
      </div>

      {/* LABEL */}
      <p className="mt-2 text-xs sm:text-sm text-center font-medium text-gray-700">
        {category.name}
      </p>
    </div>
  );
};

export default CategoryCard;
