import { useCart } from "../context/CartContext";

const CartItemRow = ({ item }) => {
  const { addToCart, removeFromCart } = useCart();

  return (
    <div className="flex items-center justify-between">
      {/* Left */}
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-400">
          Image
        </div>

        <div>
          <p className="text-sm text-gray-500">{item.name}</p>
          <p className="text-sm text-gray-500">{item.quantity}</p>
          <p className="text-sm font-semibold">₹{item.price}</p>
        </div>
      </div>

      {/* Counter */}
      <div className="flex items-center bg-green-700 text-white rounded-lg">
        <button
          onClick={() => removeFromCart(item)}
          className="
            px-2 py-1 text-sm
            sm:px-3 sm:text-lg
            font-bold
          "
        >
          −
        </button>

        <span
          className="
            px-2 text-xs
            sm:px-3 sm:text-sm
            font-semibold
          "
        >
          {item.cartQty}
        </span>

        <button
          onClick={() => addToCart(item)}
          className="
            px-2 py-1 text-sm
            sm:px-3 sm:text-lg
            font-bold
          "
        >
          +
        </button>
      </div>
    </div>
  );
};

export default CartItemRow;
