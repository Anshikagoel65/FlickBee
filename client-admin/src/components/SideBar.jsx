import { NavLink } from "react-router-dom";
import { LayoutDashboard, Image, Grid, Layers, Package } from "lucide-react";

const linkBase =
  "flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-600 transition";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white border-r min-h-screen p-4">
      <h2 className="text-2xl font-bold text-green-600 mb-8">
        FlickBee <span className="text-gray-800">Admin</span>
      </h2>

      <nav className="space-y-2">
        <NavLink to="/" end className={linkBase}>
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink to="/banners" className={linkBase}>
          <Image size={18} />
          Hero Banners
        </NavLink>

        <NavLink to="/categories" className={linkBase}>
          <Grid size={18} />
          Categories
        </NavLink>

        <NavLink to="/products" className={linkBase}>
          <Package size={18} />
          Products
        </NavLink>

        <NavLink to="/sections" className={linkBase}>
          <Layers size={18} />
          Sections
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
