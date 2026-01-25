import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { MapPin, ClipboardList, LogOut } from "lucide-react";

const Account = () => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="max-w-[1200px] mx-auto pt-10 px-3 md:px-0">
      <div className="flex gap-6">
        <aside className="hidden md:block w-[260px] h-[550px] bg-white rounded-xl border shadow-sm">
          <div className="px-5 py-6 border-b text-center font-medium">
            {user?.phone}
          </div>

          <button
            onClick={() => navigate("/account/addresses")}
            className={`w-full flex gap-4 px-5 py-4 ${
              location.pathname.includes("addresses")
                ? "bg-gray-100 font-medium"
                : "hover:bg-gray-50"
            }`}
          >
            <MapPin size={20} /> My Addresses
          </button>

          <button
            onClick={() => navigate("/account/orders")}
            className="w-full flex gap-4 px-5 py-4 hover:bg-gray-50"
          >
            <ClipboardList size={20} /> My Orders
          </button>

          <button
            onClick={logout}
            className="w-full flex gap-4 px-5 py-4 text-red-600 hover:bg-gray-50"
          >
            <LogOut size={20} /> Logout
          </button>
        </aside>
        <main className="flex-1 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Account;
