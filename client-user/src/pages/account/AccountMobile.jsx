import { ArrowLeft, ClipboardList, MapPin, LogOut } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

const AccountMobile = () => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center gap-3 px-4 pt-10 pb-4 border-b">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft />
        </button>
        <div>
          <p className="font-semibold">Account</p>
          <p className="text-sm text-gray-500">{user?.phone}</p>
        </div>
      </div>
      <p className="px-4 pt-6 pb-2 text-sm text-gray-400">Your Information</p>
      <div className="space-y-1 px-2">
        <Item
          icon={<ClipboardList />}
          label="Order History"
          onClick={() => navigate("/account/orders")}
        />
        <Item
          icon={<MapPin />}
          label="Address Book"
          onClick={() => navigate("/account/mobile/addresses")}
        />

        <Item
          icon={<LogOut />}
          label="Logout"
          danger
          onClick={() => {
            logout();
            navigate("/");
          }}
        />
      </div>
      <Outlet />
    </div>
  );
};

const Item = ({ icon, label, onClick, danger }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg ${
      danger ? "text-red-600" : "text-gray-800 hover:bg-gray-50"
    }`}
  >
    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
      {icon}
    </div>
    <span className="text-base">{label}</span>
  </button>
);

export default AccountMobile;
