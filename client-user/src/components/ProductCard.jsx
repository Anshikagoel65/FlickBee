import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE;

const ProductCard = ({ product, variant = "carousel" }) => {
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart } = useCart();
  const firstVariant = product.variants?.[0];
  const hasStock = product.variants?.some(
    (v) => Number(v.stock) > 0 && v.isAvailable !== false,
  );
  const isOutOfStock = !hasStock;
  const getQuantity = () => {
    if (!firstVariant) return 0;
    const key = `${product._id}_${firstVariant._id}`;
    return cart[key]?.cartQty || 0;
  };

  const quantity = getQuantity();
  const discountPercent =
    firstVariant?.mrp > firstVariant?.price
      ? Math.round(
          ((firstVariant.mrp - firstVariant.price) / firstVariant.mrp) * 100,
        )
      : 0;

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      className="relative bg-white border rounded-2xl p-3 cursor-pointer transition hover:shadow-md flex-shrink-0 w-[250px] h-[300px] snap-start"
    >
      {discountPercent > 0 && (
        <span className="absolute top-2 right-2 z-20 bg-yellow-400 text-black text-sm font-semibold px-2 py-0.5 rounded-md shadow">
          Save {discountPercent}%
        </span>
      )}

      <div className="relative h-36 mb-2 flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden z-0">
        <img
          src={`${API_BASE}${product.thumbnail}`}
          alt={product.name}
          className={`max-h-full max-w-full object-contain transition-all duration-200 ${
            isOutOfStock ? "opacity-40 grayscale" : ""
          }`}
        />

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-gray-700 text-white text-xs font-medium px-4 py-1 rounded-md shadow">
              Out of Stock
            </div>
          </div>
        )}
      </div>

      <h3 className="text-lg font-semibold leading-snug line-clamp-2 mb-2">
        {product.name}
      </h3>

      <p className="text-sm text-gray-500 mb-2">
        {firstVariant?.quantity} {firstVariant?.unit}
      </p>

      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm font-bold">₹{firstVariant?.price}</span>
        {firstVariant?.mrp > firstVariant?.price && (
          <span className="text-sm text-gray-400 line-through">
            ₹{firstVariant?.mrp}
          </span>
        )}
      </div>

      {discountPercent > 0 && (
        <p className="text-sm text-red-500 font-medium">Limited Time</p>
      )}

      {/* CART SECTION */}
      {isOutOfStock ? (
        <button
          disabled
          className="absolute bottom-3 right-3 px-4 py-1 bg-gray-200 text-gray-600 rounded-lg text-sm font-medium cursor-not-allowed"
        >
          Out of Stock
        </button>
      ) : quantity === 0 ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            addToCart({
              ...product,
              selectedVariant: firstVariant,
            });
          }}
          className="absolute bottom-3 right-3 px-4 py-1 border border-green-600 text-green-600 rounded-lg text-sm font-medium"
        >
          ADD
        </button>
      ) : (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-3 right-3 flex items-center border border-green-600 rounded-lg bg-green-700 text-white"
        >
          <button
            onClick={() =>
              removeFromCart({
                id: `${product._id}_${firstVariant._id}`,
              })
            }
            className="px-2 py-1 font-bold"
          >
            −
          </button>

          <span className="px-2 text-sm font-semibold">{quantity}</span>

          <button
            onClick={() =>
              addToCart({
                ...product,
                selectedVariant: firstVariant,
              })
            }
            className="px-2 py-1 font-bold"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
