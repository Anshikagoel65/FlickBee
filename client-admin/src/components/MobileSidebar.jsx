import { X, LayoutDashboard, Image, Grid, Layers, Package } from "lucide-react";
import { NavLink } from "react-router-dom";

const linkBase =
  "flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-600 transition";

const active = "bg-green-100 text-green-700 font-semibold";

const MobileSidebar = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Drawer */}
      <aside className="absolute left-0 top-0 h-full w-64 bg-white p-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-green-600">FlickBee Admin</h2>
          <button onClick={onClose} className="p-1">
            <X />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          <NavLink
            to="/"
            end
            onClick={onClose}
            className={({ isActive }) =>
              `${linkBase} ${isActive ? active : ""}`
            }
          >
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>

          <NavLink
            to="/banners"
            onClick={onClose}
            className={({ isActive }) =>
              `${linkBase} ${isActive ? active : ""}`
            }
          >
            <Image size={18} />
            Hero Banners
          </NavLink>

          <NavLink
            to="/categories"
            onClick={onClose}
            className={({ isActive }) =>
              `${linkBase} ${isActive ? active : ""}`
            }
          >
            <Grid size={18} />
            Categories
          </NavLink>

          <NavLink
            to="/products"
            onClick={onClose}
            className={({ isActive }) =>
              `${linkBase} ${isActive ? active : ""}`
            }
          >
            <Package size={18} />
            Products
          </NavLink>

          <NavLink
            to="/sections"
            onClick={onClose}
            className={({ isActive }) =>
              `${linkBase} ${isActive ? active : ""}`
            }
          >
            <Layers size={18} />
            Sections
          </NavLink>
        </nav>
      </aside>
    </div>
  );
};

export default MobileSidebar;
