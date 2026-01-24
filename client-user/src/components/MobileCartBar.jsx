import { useCart } from "../context/CartContext";

const MobileCartBar = ({ onOpenCart }) => {
  const { cart } = useCart();

  const cartItems = Object.values(cart || {});
  if (cartItems.length === 0) return null;

  const itemsTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.cartQty,
    0,
  );

  return (
    <div
      className="
        fixed
        bottom-0
        left-0
        right-0
        z-[200]
        bg-green-700
        text-white
        px-4
        py-3
        flex
        justify-between
        items-center
        lg:hidden
      "
      onClick={onOpenCart}
    >
      <div>
        <p className="text-sm font-medium">
          {cartItems.length} item{cartItems.length > 1 ? "s" : ""}
        </p>
        <p className="text-lg font-bold">₹{itemsTotal}</p>
      </div>

      <button className="bg-white text-green-700 px-4 py-2 rounded-lg font-semibold">
        View Cart →
      </button>
    </div>
  );
};

export default MobileCartBar;
