import HeroBanners from "../components/HeroBanners";
import CategoryGrid from "../components/CategoryGrid";
import ProductSection from "../components/ProductSection";

const Home = () => {
  return (
    <main className="w-full">
      <div
        className="
          max-w-[1400px] 
          mx-auto 
          px-6 
          sm:px-8 
          md:px-12 
          lg:px-16 
          xl:px-20 
          py-6
        "
      >
        <HeroBanners />
        <CategoryGrid />
        <ProductSection />
        <ProductSection />
      </div>
    </main>
  );
};

export default Home;
