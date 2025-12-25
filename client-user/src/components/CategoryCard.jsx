const CategoryCard = () => {
  return (
    <div className="flex flex-col items-center cursor-pointer">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-xl"></div>
      <p className="mt-2 text-xs sm:text-sm text-center text-gray-600">
        Category
      </p>
    </div>
  );
};

export default CategoryCard;
