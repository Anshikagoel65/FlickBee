import { Outlet } from "react-router-dom";
import Sidebar from "./SideBar";
import Topbar from "./TopBar";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Topbar />
      <div className="flex">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
