const HeroBanners = () => {
  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Hero Banners</h1>
        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Add Banner
        </button>
      </div>

      <div className="bg-white p-4 rounded text-gray-500">
        No banners added yet
      </div>
    </div>
  );
};

export default HeroBanners;
