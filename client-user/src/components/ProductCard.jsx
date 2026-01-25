import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE;

const ProductCard = ({ product, variant = "carousel" }) => {
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart } = useCart();

  const quantity = cart[product._id]?.cartQty || 0;

  const discountPercent =
    product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      className="
    relative
    bg-white
    border
    rounded-2xl
    p-3
    cursor-pointer
    transition
    hover:shadow-md
    flex-shrink-0
    w-[250px]
    h-[300px]
    snap-start
  "
    >
      {discountPercent > 0 && (
        <span className="absolute top-2 right-2 bg-yellow-400 text-black text-sm font-semibold px-2 py-0.5 rounded-md">
          Save {discountPercent}%
        </span>
      )}

      <div className="h-36 rounded-xl overflow-hidden mb-2 flex items-center justify-center">
        <img
          src={`${API_BASE}${product.images?.[0] || product.thumbnail}`}
          alt={product.name}
          className="w-full h-full object-contain"
        />
      </div>

      <h3 className="text-lg font-semibold leading-snug line-clamp-2 mb-2">
        {product.name}
      </h3>

      <p className="text-sm text-gray-500 mb-2">
        {product.quantity?.[0]} {product.unit?.[0]}
      </p>

      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm font-bold">₹{product.price}</span>
        {product.mrp > product.price && (
          <span className="text-sm text-gray-400 line-through">
            ₹{product.mrp}
          </span>
        )}
      </div>

      {discountPercent > 0 && (
        <p className="text-sm text-red-500 font-medium">Limited Time</p>
      )}

      {quantity === 0 ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product);
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
            onClick={() => removeFromCart(product)}
            className="px-2 py-1 font-bold"
          >
            −
          </button>
          <span className="px-2 text-sm font-semibold">{quantity}</span>
          <button
            onClick={() => addToCart(product)}
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
