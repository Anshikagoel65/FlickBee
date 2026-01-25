import { useEffect, useState } from "react";
import { getMyOrders } from "../../services/orderApi";
import { useNavigate } from "react-router-dom";
import OrderRecommendations from "../../components/OrderRecommendations";

const formatDateTime = (date) => {
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};
const shortOrderId = (id) => id.slice(-6).toUpperCase();
const API_BASE = process.env.REACT_APP_API_BASE;

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    getMyOrders().then((res) => setOrders(res.data));
  }, []);

  if (!orders.length) {
    return (
      <div className="p-6 text-center text-gray-500">
        You haven’t placed any orders yet
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-2">My Orders</h1>

      {orders.map((order) => {
        const maxImages = 3;
        const visibleItems = order.items.slice(0, maxImages);
        const remaining = order.items.length - maxImages;

        return (
          <div
            key={order._id}
            className="bg-white rounded-xl border p-4 space-y-3"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-bold">✓</span>
                </div>

                <div>
                  <p className="text-lg font-bold text-black px-3">
                    Order #{shortOrderId(order._id)}
                  </p>
                  <p className="text-md text-black px-3">
                    ₹{order.grandTotal} • {formatDateTime(order.createdAt)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate(`/account/orders/${order._id}`)}
                className="text-3xl text-gray-900 hover:text-gray-700"
              >
                →
              </button>
            </div>
            <div className="flex gap-3 pt-6">
              {visibleItems.map((item, index) => (
                <div
                  key={index}
                  className="w-16 h-16 rounded-lg border bg-gray-50 flex items-center justify-center overflow-hidden"
                >
                  <img
                    src={`${API_BASE}${item.image}`}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}

              {remaining > 0 && (
                <div className="w-16 h-16 rounded-lg border bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-600">
                  +{remaining}
                </div>
              )}
            </div>
          </div>
        );
      })}

      <OrderRecommendations />
    </div>
  );
};

export default MyOrders;
