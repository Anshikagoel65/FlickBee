import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOrderById } from "../../services/orderApi";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download } from "lucide-react";

const API_BASE = process.env.REACT_APP_API_BASE;

const OrderInvoice = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getOrderById(orderId).then((res) => setOrder(res.data));
  }, [orderId]);

  if (!order) {
    return <div className="p-6">Loading invoice...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-lg border flex items-center justify-center hover:bg-gray-50"
        >
          <ArrowLeft size={18} />
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 text-green-600 text-sm font-medium"
        >
          <Download size={16} />
          Download Invoice
        </button>
      </div>
      <div className="bg-white rounded-xl border p-4">
        <h1 className="text-xl font-bold">
          Invoice #{order._id.slice(-6).toUpperCase()}
        </h1>
        <p className="text-sm text-gray-500">
          Placed on {new Date(order.createdAt).toLocaleString("en-IN")}
        </p>
      </div>
      <div className="bg-white rounded-xl border p-4 space-y-4">
        <h2 className="font-bold">Items</h2>

        {order.items.map((item, idx) => (
          <div key={idx} className="flex gap-4 items-center">
            <img
              src={`${API_BASE}${item.image}`}
              alt={item.name}
              className="w-14 h-14 rounded-lg border object-contain"
            />

            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">
                {item.quantity} {item.unit} × {item.count}
              </p>
            </div>

            <p className="font-semibold">₹{item.price * item.count}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border p-4 space-y-2">
        <h2 className="font-bold">Bill Summary</h2>

        <div className="flex justify-between text-sm">
          <span>Item total</span>
          <span>₹{order.itemTotal}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span>Delivery fee</span>
          <span>₹{order.deliveryFee}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span>Tax</span>
          <span>₹{order.taxAmount}</span>
        </div>

        <hr />

        <div className="flex justify-between font-bold">
          <span>Total paid</span>
          <span>₹{order.grandTotal}</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-4">
        <h2 className="font-bold mb-2">Delivered to</h2>

        {order.addressId ? (
          <p className="text-sm text-gray-600 leading-relaxed">
            <span className="font-medium">{order.addressId.name}</span>,{" "}
            {order.addressId.houseNo}, {order.addressId.street1}
            {order.addressId.street2 && `, ${order.addressId.street2}`},{" "}
            {order.addressId.city}, {order.addressId.state} -{" "}
            {order.addressId.postalCode}
            <br />
            <span className="text-gray-500">
              Phone: {order.addressId.phone}
            </span>
          </p>
        ) : (
          <p className="text-sm text-gray-400">Address not available</p>
        )}
      </div>
    </div>
  );
};

export default OrderInvoice;
