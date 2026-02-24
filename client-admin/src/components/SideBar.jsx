import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Image,
  Grid,
  Layers,
  Package,
  KeyRound,
  ShoppingBag,
} from "lucide-react";
import { Users as UsersIcon } from "lucide-react";
import { useOrderNotification } from "../context/OrderNotificationContext";

const linkBase = "flex items-center gap-3 px-4 py-2 rounded-lg transition";

const Sidebar = () => {
  const { hasNewOrder, setHasNewOrder } = useOrderNotification();
  return (
    <aside className="w-64 bg-white border-r min-h-screen p-4">
      <h2 className="text-2xl font-bold text-green-600 mb-8">
        FlickBee <span className="text-gray-800">Admin</span>
      </h2>

      <nav className="space-y-2">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `${linkBase} ${
              isActive
                ? "bg-green-100 text-green-600 font-medium"
                : "text-gray-700 hover:bg-green-50 hover:text-green-600"
            }`
          }
        >
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink
          to="/banners"
          className={({ isActive }) =>
            `${linkBase} ${
              isActive
                ? "bg-green-100 text-green-600 font-medium"
                : "text-gray-700 hover:bg-green-50 hover:text-green-600"
            }`
          }
        >
          <Image size={18} />
          Hero Banners
        </NavLink>

        <NavLink
          to="/categories"
          className={({ isActive }) =>
            `${linkBase} ${
              isActive
                ? "bg-green-100 text-green-600 font-medium"
                : "text-gray-700 hover:bg-green-50 hover:text-green-600"
            }`
          }
        >
          <Grid size={18} />
          Categories
        </NavLink>

        <NavLink
          to="/products"
          className={({ isActive }) =>
            `${linkBase} ${
              isActive
                ? "bg-green-100 text-green-600 font-medium"
                : "text-gray-700 hover:bg-green-50 hover:text-green-600"
            }`
          }
        >
          <Package size={18} />
          Products
        </NavLink>

        <NavLink
          to="/sections"
          className={({ isActive }) =>
            `${linkBase} ${
              isActive
                ? "bg-green-100 text-green-600 font-medium"
                : "text-gray-700 hover:bg-green-50 hover:text-green-600"
            }`
          }
        >
          <Layers size={18} />
          Sections
        </NavLink>

        <NavLink
          to="/users"
          className={({ isActive }) =>
            `${linkBase} ${
              isActive
                ? "bg-green-100 text-green-600 font-medium"
                : "text-gray-700 hover:bg-green-50 hover:text-green-600"
            }`
          }
        >
          <UsersIcon size={18} />
          Users
        </NavLink>

        <NavLink
          to="/orders"
          onClick={() => setHasNewOrder(false)}
          className={({ isActive }) =>
            `${linkBase} ${
              isActive
                ? "bg-green-100 text-green-600 font-medium"
                : "text-gray-700 hover:bg-green-50 hover:text-green-600"
            }`
          }
        >
          <ShoppingBag size={18} />
          <span className="flex items-center gap-2">
            Orders
            {hasNewOrder && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
                New
              </span>
            )}
          </span>
        </NavLink>

        {/* NEW Change Password */}
        <NavLink
          to="/change-password"
          className={({ isActive }) =>
            `${linkBase} ${
              isActive
                ? "bg-green-100 text-green-600 font-medium"
                : "text-gray-700 hover:bg-green-50 hover:text-green-600"
            }`
          }
        >
          <KeyRound size={18} />
          Change Password
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
