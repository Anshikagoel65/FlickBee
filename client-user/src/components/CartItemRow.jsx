import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE;

const CartItemRow = ({ item, onClose }) => {
  const navigate = useNavigate();
  const { increaseCartQty, removeFromCart } = useCart();
  const imagePath = item.thumbnail || item.images?.[0];
  const imageUrl = imagePath
    ? `${API_BASE.replace(/\/$/, "")}/${imagePath.replace(/^\//, "")}`
    : "";

  const handleAdd = () => {
    console.log("PLUS CLICKED:", item);
    increaseCartQty(item.id);
  };

  const handleRemove = () => {
    console.log("MINUS CLICKED:", item);
    removeFromCart(item);
  };

  const handleProductClick = () => {
    onClose();
    navigate(`/product/${item.productId}?variant=${item.variantId}`);
  };

  return (
    <div className="flex items-center justify-between">
      <div
        onClick={handleProductClick}
        className="flex items-center gap-3 cursor-pointer"
      >
        <div className="w-14 h-14 rounded-lg overflow-hidden">
          <img
            src={imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <p className="text-sm text-gray-500">{item.name}</p>
          <p className="text-sm text-gray-500">{item.quantity}</p>
          <p className="text-sm font-semibold">₹{item.price}</p>
        </div>
      </div>

      <div className="flex items-center bg-green-700 text-white rounded-lg">
        <button
          onClick={handleRemove}
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
          {item.cartQty ?? 0}
        </span>

        <button
          onClick={handleAdd}
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
