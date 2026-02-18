import { Plus, ArrowLeft, Home, Pencil, Building2, MapPin } from "lucide-react";
import { useDrawer } from "../context/AddressDrawerContext";
import { useEffect, useState } from "react";
import { getAddresses } from "../services/addressApi";
import AddressModal from "./AddressModal";
import { useCart } from "../context/CartContext";
import { placeOrder } from "../services/orderApi";
import { useNavigate } from "react-router-dom";

const getTypeIcon = (type) => {
  switch (type) {
    case "home":
      return <Home size={18} className="text-green-600" />;
    case "work":
      return <Building2 size={18} className="text-blue-600" />;
    default:
      return <MapPin size={18} className="text-gray-600" />;
  }
};

const AddressDrawer = () => {
  const { drawerView, setDrawerView } = useDrawer();
  const [addresses, setAddresses] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cod");
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const cartItems = Object.values(cart || {});

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

  const fetchAddresses = async () => {
    const res = await getAddresses();
    setAddresses(res.data);
  };

  useEffect(() => {
    if (drawerView === "address-list") {
      setShowAddressModal(false);
      setEditAddress(null);
      fetchAddresses();
    }
  }, [drawerView]);

  const handleProceedToPay = async () => {
    if (!selectedAddressId) {
      alert("Please select an address");
      return;
    }

    if (!selectedPaymentMethod) {
      alert("Please select a payment method");
      return;
    }

    const items = Object.values(cart).map((item) => ({
      productId: item._id,
      name: item.name,
      price: item.price,
      mrp: item.mrp,
      quantity: Array.isArray(item.quantity)
        ? Number(item.quantity[0])
        : Number(item.quantity),
      unit: Array.isArray(item.unit) ? item.unit[0] : item.unit,
      count: item.cartQty,
      image: item.image || item.thumbnail || item.images?.[0] || null,
      isSubstituted: false,
    }));

    await placeOrder({
      addressId: selectedAddressId,
      items,
      itemTotal: itemsTotal,
      taxAmount: 0,
      deliveryFee: deliveryCharge,
      discount: 0,
      grandTotal,
      payment: {
        method: selectedPaymentMethod,
        status: selectedPaymentMethod === "cod" ? "pending" : "success",
        amountPaid: grandTotal,
        paidAt: selectedPaymentMethod !== "cod" ? new Date() : null,
      },
    });

    clearCart();
    setDrawerView(null);
    navigate("/account/orders");
  };

  if (drawerView !== "address-list") return null;

  return (
    <>
      <div className="fixed inset-0 z-[100]">
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-[#f5f7fa] flex flex-col">
          <div className="bg-white px-4 py-4 flex items-center gap-3 border-b">
            <button onClick={() => setDrawerView(null)}>
              <ArrowLeft />
            </button>
            <h2 className="text-lg font-bold">Select delivery address</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* ADD NEW ADDRESS */}
            <button
              onClick={() => {
                setEditAddress(null);
                setShowAddressModal(true);
              }}
              className="w-full bg-white rounded-xl p-4 flex items-center gap-3 border"
            >
              <Plus className="text-green-600" />
              <span className="text-green-600 font-medium">
                Add a new address
              </span>
            </button>

            {/* SAVED ADDRESS TITLE */}
            {addresses.length > 0 && (
              <p className="text-sm text-gray-500 font-medium">
                Your saved address
              </p>
            )}

            {/* ADDRESS CARDS */}
            {addresses.map((addr) => (
              <div
                key={addr._id}
                onClick={() => setSelectedAddressId(addr._id)}
                className={`bg-white rounded-xl p-4 border flex justify-between items-start cursor-pointer
                             ${
                               selectedAddressId === addr._id
                                 ? "border-green-600 bg-green-50"
                                 : "border-gray-200"
                             }`}
              >
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    {getTypeIcon(addr.type)}
                  </div>

                  <div>
                    <p className="font-semibold capitalize">{addr.type}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {addr.name}, {addr.houseNo}, {addr.street1},{" "}
                      {addr.street2 && `${addr.street2}, `}
                      {addr.city}, {addr.state} - {addr.postalCode}
                    </p>
                  </div>
                </div>

                {/* EDIT */}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditAddress(addr);
                    setShowAddressModal(true);
                  }}
                  className="text-green-600"
                >
                  <Pencil size={16} />
                </button>
              </div>
            ))}
          </div>
          <div className="bg-white border-t p-4 space-y-3">
            <p className="font-semibold text-sm text-gray-700">
              Select Payment Method
            </p>

            <div className="space-y-2">
              {["cod", "upi", "card"].map((method) => (
                <label
                  key={method}
                  className="flex items-center gap-3 cursor-pointer border rounded-lg p-3"
                >
                  <input
                    type="radio"
                    value={method}
                    checked={selectedPaymentMethod === method}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  />
                  <span className="capitalize">{method}</span>
                </label>
              ))}
            </div>
          </div>
          {selectedAddressId && (
            <div className="bg-white border-t p-4 shrink-0">
              <button
                onClick={handleProceedToPay}
                className="w-full bg-green-700 text-white rounded-xl py-4 flex justify-between items-center px-4"
              >
                <div>
                  <p className="text-lg font-bold">₹{grandTotal}</p>
                  <p className="text-xs text-green-100">TOTAL</p>
                </div>
                <span className="text-lg font-semibold">Proceed To Pay →</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {showAddressModal && (
        <AddressModal
          initialData={editAddress}
          onClose={() => {
            setShowAddressModal(false);
            setDrawerView("address-list");
          }}
          onSave={fetchAddresses}
        />
      )}
    </>
  );
};

export default AddressDrawer;
