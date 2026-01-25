import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE;

const CategorySidebar = ({ categories, activeSlug }) => {
  const navigate = useNavigate();

  return (
    <aside
      className="
        flex
        lg:block
        overflow-x-auto
        lg:overflow-y-auto
        lg:w-32
        flex-shrink-0
        lg:border-r
        lg:pr-2
        pb-2
        lg:pt-6
        lg:sticky
        lg:top-24
      "
    >
      <div className="flex lg:flex-col gap-3 lg:gap-4">
        {categories.map((cat) => {
          const isActive = activeSlug === cat.slug;

          return (
            <div
              key={cat._id}
              onClick={() => navigate(`/category/${cat.slug}`)}
              className={`flex flex-col items-center cursor-pointer p-2 rounded-lg transition
                min-w-[72px]
                ${
                  isActive
                    ? "bg-green-100 border border-green-400"
                    : "hover:bg-gray-100"
                }`}
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={`${API_BASE}${cat.image}`}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <p
                className={`mt-1 text-[13px] text-center leading-tight
                  ${
                    isActive ? "text-green-700 font-semibold" : "text-gray-700"
                  }`}
              >
                {cat.name}
              </p>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default CategorySidebar;
