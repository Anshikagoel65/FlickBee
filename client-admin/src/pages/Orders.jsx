import { useEffect, useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import { useOrderNotification } from "../context/OrderNotificationContext";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { newOrdersCount } = useOrderNotification();

  const fetchOrders = async () => {
    try {
      const res = await API.get("/admin/orders");
      setOrders(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (newOrdersCount > 0) {
      fetchOrders();
    }
  }, [newOrdersCount]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "placed":
        return "bg-gray-100 text-gray-700";
      case "acceptedByStore":
        return "bg-blue-100 text-blue-700";
      case "packing":
        return "bg-yellow-100 text-yellow-700";
      case "packed":
        return "bg-indigo-100 text-indigo-700";
      case "assignedToDelivery":
        return "bg-purple-100 text-purple-700";
      case "outForDelivery":
        return "bg-orange-100 text-orange-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "refunded":
        return "bg-pink-100 text-pink-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPaymentStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "success":
        return "bg-green-100 text-green-700";
      case "failed":
        return "bg-red-100 text-red-700";
      case "refunded":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-6">Orders</h2>

      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3 border">User</th>
              <th className="p-3 border">Address</th>
              <th className="p-3 border">Total</th>
              <th className="p-3 border">Payment</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="transition">
                <td className="p-3 border">
                  <div>
                    <p className="font-medium">{order.addressId?.name}</p>
                    <p className="text-xs text-gray-500">
                      {order.userId?.phone}
                    </p>
                  </div>
                </td>

                <td className="p-3 border text-xs">
                  {order.addressId?.houseNo}, {order.addressId?.street1},{" "}
                  {order.addressId?.city}, {order.addressId?.state}
                </td>

                <td className="p-3 border">₹ {order.grandTotal}</td>

                <td className="p-3 border">
                  <div className="flex flex-col gap-1">
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium w-fit ${getPaymentStyle(
                        order.payment?.status,
                      )}`}
                    >
                      {order.payment?.status}
                    </span>

                    <select
                      value={order.payment?.status}
                      disabled={order.payment?.status === "refunded"}
                      onChange={async (e) => {
                        const newStatus = e.target.value;

                        try {
                          await API.put(
                            `/admin/orders/${order._id}/payment-status`,
                            { status: newStatus },
                          );

                          toast.success("Payment status updated");

                          setOrders((prev) =>
                            prev.map((o) =>
                              o._id === order._id
                                ? {
                                    ...o,
                                    payment: {
                                      ...o.payment,
                                      status: newStatus,
                                    },
                                  }
                                : o,
                            ),
                          );
                        } catch (err) {
                          toast.error("Failed to update payment status");
                        }
                      }}
                      className="border p-1 rounded text-xs"
                    >
                      <option value="pending">Pending</option>
                      <option value="success">Success</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                </td>

                <td className="p-3 border">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusStyle(
                        order.currentStatus,
                      )}`}
                    >
                      {order.currentStatus}
                    </span>

                    <select
                      value={order.currentStatus}
                      disabled={
                        order.currentStatus === "delivered" ||
                        order.currentStatus === "cancelled" ||
                        order.currentStatus === "refunded"
                      }
                      onChange={async (e) => {
                        const newStatus = e.target.value;

                        try {
                          await API.put(`/admin/orders/${order._id}/status`, {
                            status: newStatus,
                          });

                          toast.success("Status updated");

                          setOrders((prev) =>
                            prev.map((o) =>
                              o._id === order._id
                                ? {
                                    ...o,
                                    currentStatus: newStatus,
                                  }
                                : o,
                            ),
                          );
                        } catch (err) {
                          toast.error("Failed to update status");
                        }
                      }}
                      className="border p-1 rounded text-xs"
                    >
                      <option value="placed">Placed</option>
                      <option value="acceptedByStore">Accepted</option>
                      <option value="packing">Packing</option>
                      <option value="packed">Packed</option>
                      <option value="assignedToDelivery">Assigned</option>
                      <option value="outForDelivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                </td>

                <td className="p-3 border">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>

                <td className="p-3 border">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white w-3/4 max-h-[90vh] overflow-y-auto p-6 rounded">
            <h2 className="text-xl font-bold mb-4">
              Order #{selectedOrder._id.slice(-6)}
            </h2>

            <p>
              <strong>Name:</strong> {selectedOrder.addressId?.name}
            </p>
            <p>
              <strong>Phone:</strong> {selectedOrder.userId?.phone}
            </p>

            <p className="mt-2">
              <strong>Full Address:</strong>
              <br />
              {selectedOrder.addressId?.houseNo},{" "}
              {selectedOrder.addressId?.street1},{" "}
              {selectedOrder.addressId?.street2},{" "}
              {selectedOrder.addressId?.city}, {selectedOrder.addressId?.state},{" "}
              {selectedOrder.addressId?.postalCode}
            </p>

            <div className="mt-4">
              <h3 className="font-semibold mb-2">Items</h3>
              {selectedOrder.items.map((item, index) => (
                <div key={index} className="border p-2 mb-2">
                  <p>{item.name}</p>
                  <p>Qty: {item.count}</p>
                  <p>Price: ₹ {item.price}</p>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <p>
                <strong>Grand Total:</strong> ₹ {selectedOrder.grandTotal}
              </p>
              <p>
                <strong>Payment:</strong> {selectedOrder.payment?.method}
              </p>
              <p>
                <strong>Status:</strong> {selectedOrder.currentStatus}
              </p>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="mt-6 bg-red-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
