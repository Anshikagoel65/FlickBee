const HeroBanners = () => {
  return (
    <section className="mb-12 mt-8">
      <div
        className="
          max-w-[1000px]
          grid
          grid-cols-1
          md:grid-cols-3
          gap-4
        "
      >
        <div className="h-48 rounded-xl bg-gray-200"></div>
        <div className="h-48 rounded-xl bg-gray-200"></div>
        <div className="h-48 rounded-xl bg-gray-200"></div>
      </div>
    </section>
  );
};

export default HeroBanners;
