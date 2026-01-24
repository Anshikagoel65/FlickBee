import { X } from "lucide-react";
import { useAuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import CartItemRow from "./CartItemRow";
import BillDetails from "./BillDetails";
import { useLocationContext } from "../context/LocationContext";
import { useDrawer } from "../context/AddressDrawerContext";

const CartDrawer = ({ isOpen, onClose }) => {
  const { deliveryTime } = useLocationContext();
  const { user, setIsLoginOpen, setPostLoginAction, isAuthenticated } =
    useAuthContext();
  const { setDrawerView } = useDrawer();

  const { cart } = useCart();
  if (!isOpen) return null;

  const cartItems = Object.values(cart);

  const itemsTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.cartQty,
    0,
  );

  const DELIVERY_THRESHOLD = 100;
  const DELIVERY_CHARGE = 25;
  const handlingCharge = 2;

  const isFreeDelivery = itemsTotal >= DELIVERY_THRESHOLD;
  const deliveryCharge = isFreeDelivery ? 0 : DELIVERY_CHARGE;

  const grandTotal = itemsTotal + deliveryCharge + handlingCharge;

  const handleProceed = () => {
    onClose();

    if (isAuthenticated || user) {
      setDrawerView("address-list");
      return;
    }

    setPostLoginAction(() => () => {
      setDrawerView("address-list");
    });

    setIsLoginOpen(true);
  };
  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-[#f5f7fa] flex flex-col">
        {/* HEADER (fixed) */}
        <div className="bg-white p-4 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-bold">My Cart</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto">
          {/* Delivery Info */}
          <div className="p-4">
            <div className="bg-white rounded-xl p-4">
              <p className="font-bold">
                {deliveryTime ? (
                  isFreeDelivery ? (
                    <>Free delivery in {deliveryTime} minutes</>
                  ) : (
                    <>Delivery in {deliveryTime} minutes</>
                  )
                ) : (
                  "Delivery time unavailable"
                )}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Shipment of {cartItems.length} items
              </p>

              <div className="mt-4 space-y-4">
                {cartItems.map((item) => (
                  <CartItemRow key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>

          {/* Bill Details */}
          <div className="px-4">
            <BillDetails
              itemsTotal={itemsTotal}
              deliveryCharge={deliveryCharge}
              isFreeDelivery={isFreeDelivery}
              handlingCharge={handlingCharge}
              grandTotal={grandTotal}
            />
          </div>

          {/* Cancellation Policy */}
          <div className="p-4">
            <div className="bg-white rounded-xl p-4">
              <h3 className="font-bold text-base mb-1">Cancellation Policy</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Orders cannot be cancelled once packed for delivery. In case of
                unexpected delays, a refund will be provided, if applicable.
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR (fixed) */}
        <div className="p-4 bg-white border-t shrink-0">
          <button
            onClick={handleProceed}
            className="w-full bg-green-700 text-white rounded-xl py-4 flex justify-between items-center px-4"
          >
            <div>
              <p className="text-lg font-bold">₹{grandTotal}</p>
              <p className="text-xs text-gray-200">TOTAL</p>
            </div>
            <span className="text-lg font-semibold">Proceed →</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
