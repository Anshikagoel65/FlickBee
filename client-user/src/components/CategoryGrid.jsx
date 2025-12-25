import CategoryCard from "./CategoryCard";

const CategoryGrid = () => {
  return (
    <section
      className="
        grid
        grid-cols-3
        sm:grid-cols-4
        md:grid-cols-6
        lg:grid-cols-8
        xl:grid-cols-10
        gap-4
      "
    >
      {Array.from({ length: 20 }).map((_, index) => (
        <CategoryCard key={index} />
      ))}
    </section>
  );
};

export default CategoryGrid;
