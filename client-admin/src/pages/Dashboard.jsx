import { useOrderNotification } from "../context/OrderNotificationContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { newOrdersCount, setNewOrdersCount } = useOrderNotification();
  const navigate = useNavigate();

  const cards = [
    { name: "Analytics", path: "/analytics" },
    { name: "Hero Banners", path: "/banners" },
    { name: "Categories", path: "/categories" },
    { name: "Products", path: "/products" },
    { name: "Sections", path: "/sections" },
    { name: "Users", path: "/users" },
    { name: "Orders", path: "/orders" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow mb-6 relative">
        <p className="text-sm opacity-90">New Orders</p>
        <p className="text-3xl font-bold mt-1">{newOrdersCount}</p>
        {newOrdersCount > 0 && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
            {newOrdersCount}
          </span>
        )}
        {newOrdersCount > 0 && (
          <button
            onClick={() => setNewOrdersCount(0)}
            className="mt-4 bg-white text-green-600 px-4 py-1 rounded text-sm font-medium hover:bg-gray-100 transition"
          >
            Mark as Viewed
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((item) => (
          <div
            key={item.name}
            onClick={() => navigate(item.path)}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md hover:scale-105 transition cursor-pointer"
          >
            <p className="text-gray-500 text-sm">Manage</p>
            <p className="text-lg font-semibold mt-1">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
