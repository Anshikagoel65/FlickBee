const ProductCard = () => {
  return (
    <div className="min-w-[180px] max-w-[180px] bg-white border rounded-xl p-3 flex-shrink-0">
      {/* Image */}
      <div className="h-36 bg-gray-200 rounded-lg mb-3"></div>

      {/* Title */}
      <div className="h-5 bg-gray-200 rounded w-4/5 mb-5"></div>

      {/* Quantity */}
      <div className="h-3 bg-gray-200 rounded w-2/5 mb-4"></div>

      {/* Price + Button */}
      <div className="flex items-center justify-between">
        <div className="h-4 bg-gray-200 rounded w-10"></div>
        <div className="h-8 w-14 border border-green-600 rounded-lg"></div>
      </div>
    </div>
  );
};

export default ProductCard;
