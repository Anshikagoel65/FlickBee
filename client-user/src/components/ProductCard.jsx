import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const { cart, addToCart, removeFromCart } = useCart();
  const quantity = cart[product.id]?.cartQty || 0;

  return (
    <div className="min-w-[180px] max-w-[180px] bg-white border rounded-xl p-3 flex-shrink-0">
      {/* Image */}
      <div className="h-36 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
        <span className="text-gray-400 text-sm">Image</span>
      </div>

      {/* Title */}
      <h3 className="text-sm font-medium mb-1 truncate">{product.name}</h3>

      {/* Quantity */}
      <p className="text-xs text-gray-500 mb-2">Qty: {product.quantity}</p>

      {/* Price + Button */}
      <div className="flex items-center justify-between">
        <span className="font-semibold text-sm">₹{product.price}</span>

        {quantity === 0 ? (
          <button
            onClick={() => addToCart(product)}
            className="px-4 py-1 border border-green-600 text-green-600 rounded-lg text-sm font-medium"
          >
            ADD
          </button>
        ) : (
          <div className="flex items-center border border-green-600 rounded-lg bg-green-700 text-white">
            <button
              onClick={() => removeFromCart(product)}
              className="px-2 py-1 font-bold"
            >
              -
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
    </div>
  );
};

export default ProductCard;
