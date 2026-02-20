import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductById } from "../services/productApi";
import { useCart } from "../context/CartContext";

const API_BASE = process.env.REACT_APP_API_BASE;

const ProductPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const variantIdFromUrl = searchParams.get("variant");

  const { cart, addToCart, removeFromCart } = useCart();

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    getProductById(id).then((data) => {
      setProduct(data);
      setActiveImage(data.thumbnail);

      if (data.variants?.length) {
        if (variantIdFromUrl) {
          const matchedVariant = data.variants.find(
            (v) => v._id === variantIdFromUrl,
          );
          setSelectedVariant(matchedVariant || data.variants[0]);
        } else {
          setSelectedVariant(data.variants[0]);
        }
      }
    });
  }, [id, variantIdFromUrl]);

  if (!product || !selectedVariant) {
    return (
      <div className="pt-[80px] flex justify-center items-center text-gray-500">
        Loading product...
      </div>
    );
  }

  const key = `${product._id}_${selectedVariant._id}`;
  const quantity = cart[key]?.cartQty || 0;

  const isOutOfStock =
    selectedVariant.stock <= 0 || selectedVariant.isAvailable === false;

  const discountPercent =
    selectedVariant.mrp > selectedVariant.price
      ? Math.round(
          ((selectedVariant.mrp - selectedVariant.price) /
            selectedVariant.mrp) *
            100,
        )
      : 0;

  return (
    <div className="max-w-[1200px] mx-auto px-4 pt-[80px] pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* IMAGE SECTION */}
        <div>
          <div className="w-full h-[240px] sm:h-[320px] lg:h-[420px] bg-white border rounded-xl flex items-center justify-center">
            <img
              src={`${API_BASE}${activeImage}`}
              alt={product.name}
              className="max-h-full object-contain"
            />
          </div>

          <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
            {[product.thumbnail, ...(product.images || [])].map((img, i) => (
              <div
                key={i}
                onClick={() => setActiveImage(img)}
                className={`w-14 h-14 sm:w-16 sm:h-16 border rounded-lg overflow-hidden cursor-pointer flex-shrink-0 ${
                  activeImage === img ? "border-green-500" : ""
                }`}
              >
                <img
                  src={`${API_BASE}${img}`}
                  className="w-full h-full object-cover"
                  alt=""
                />
              </div>
            ))}
          </div>
        </div>

        {/* DETAILS SECTION */}
        <div>
          <p className="text-xs sm:text-sm text-gray-500 mb-2">
            Home / {product.category?.name}
          </p>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">
            {product.name}
          </h1>

          {/* VARIANT SELECTOR */}
          <h3 className="text-sm font-semibold mt-6 mb-3">Select Unit</h3>

          <div className="flex flex-wrap sm:flex-wrap gap-3 mb-6">
            {product.variants.map((variant) => {
              const discount =
                variant.mrp > variant.price
                  ? Math.round(
                      ((variant.mrp - variant.price) / variant.mrp) * 100,
                    )
                  : 0;

              const isSelected = selectedVariant._id === variant._id;

              const variantOutOfStock =
                variant.stock <= 0 || variant.isAvailable === false;

              return (
                <div
                  key={variant._id}
                  onClick={() => {
                    if (!variantOutOfStock) {
                      setSelectedVariant(variant);
                    }
                  }}
                  className={`border rounded-xl p-3 min-w-[120px] sm:min-w-[140px] ${
                    variantOutOfStock
                      ? "border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed"
                      : isSelected
                        ? "border-green-600 bg-green-50 cursor-pointer"
                        : "border-gray-200 cursor-pointer"
                  }`}
                >
                  {discount > 0 && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                      {discount}% OFF
                    </span>
                  )}

                  <div className="mt-2 font-medium text-sm sm:text-base">
                    {variant.quantity} {variant.unit}
                  </div>

                  <div className="mt-1 text-sm">
                    ₹{variant.price}
                    {variant.mrp > variant.price && (
                      <span className="line-through text-gray-400 ml-2">
                        ₹{variant.mrp}
                      </span>
                    )}
                  </div>

                  {variantOutOfStock && (
                    <p className="text-xs text-red-500 mt-1">Out of Stock</p>
                  )}
                </div>
              );
            })}
          </div>

          {/* PRICE */}
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xl sm:text-2xl font-bold">
              ₹{selectedVariant.price}
            </span>
            {selectedVariant.mrp > selectedVariant.price && (
              <span className="text-gray-400 line-through text-base sm:text-lg">
                ₹{selectedVariant.mrp}
              </span>
            )}
          </div>

          <p className="text-xs text-gray-500 mb-6">Inclusive of all taxes</p>

          {/* CART */}
          {isOutOfStock ? (
            <button
              disabled
              className="bg-gray-300 text-gray-600 px-6 py-3 rounded-lg text-base font-semibold w-full sm:w-[200px] cursor-not-allowed"
            >
              Out of Stock
            </button>
          ) : quantity === 0 ? (
            <button
              onClick={() =>
                addToCart({
                  ...product,
                  selectedVariant,
                })
              }
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-base font-semibold w-full sm:w-[200px]"
            >
              Add to cart
            </button>
          ) : (
            <div className="w-full sm:w-[220px] mx-2 sm:mx-0 bg-green-600 text-white px-6 py-3 rounded-xl flex items-center justify-between">
              <button
                onClick={() => removeFromCart({ id: key })}
                className="text-2xl font-bold px-4 focus:outline-none"
              >
                −
              </button>

              <span className="text-lg font-semibold">{quantity}</span>

              <button
                onClick={() =>
                  addToCart({
                    ...product,
                    selectedVariant,
                  })
                }
                className="text-2xl font-bold px-4 focus:outline-none"
              >
                +
              </button>
            </div>
          )}

          {/* DESCRIPTION */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-600 text-sm sm:text-base">
              {product.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
