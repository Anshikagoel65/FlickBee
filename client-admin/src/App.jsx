import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import HeroBanners from "./pages/HeroBanners";
import Categories from "./pages/Categories";
import Sections from "./pages/Sections";
import Products from "./pages/Products";
import Login from "./pages/Login";
import AdminLayout from "./components/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import ChangePassword from "./pages/ChangePassword";
import Users from "./pages/Users";
import Orders from "./pages/Orders";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="banners" element={<HeroBanners />} />
          <Route path="categories" element={<Categories />} />
          <Route path="products" element={<Products />} />
          <Route path="sections" element={<Sections />} />
          <Route path="users" element={<Users />} />
          <Route path="orders" element={<Orders />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
