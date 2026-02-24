import { Menu, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileSidebar from "./MobileSidebar";

const Topbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo");
    navigate("/login");
  };

  return (
    <>
      <header className="h-14 bg-white border-b flex items-center justify-between px-4">
        {/* Left side */}
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded hover:bg-gray-100 md:hidden"
          >
            <Menu size={20} />
          </button>

          <h1 className="font-bold text-green-600 hidden md:block">
            FlickBee Admin
          </h1>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {adminInfo && (
            <span className="text-sm text-gray-600 hidden sm:block">
              {adminInfo.name}
            </span>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-red-500 hover:text-red-600"
          >
            <LogOut size={18} />
            <span className="hidden sm:block">Logout</span>
          </button>
        </div>
      </header>

      {open && <MobileSidebar onClose={() => setOpen(false)} />}
    </>
  );
};

export default Topbar;
