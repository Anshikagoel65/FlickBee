console.log("🔥 MyOrders page rendered");

const MyOrders = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">My Orders</h2>

      <div className="border rounded-lg p-4">
        <p className="font-semibold">Arrived in 18 minutes</p>
        <p className="text-sm text-gray-500">₹205 • 04 Dec, 4:14 pm</p>
      </div>
    </div>
  );
};

export default MyOrders;
