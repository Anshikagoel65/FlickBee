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
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import Analytics from "./pages/Analytics";

function App() {
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio("/notification.mp3");
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
    });

    socket.on("new-order", (data) => {
      audioRef.current.play().catch(() => {});

      toast(
        <div>
          <p className="font-semibold text-base">New Order Received</p>
          <p className="text-sm opacity-80">Amount: ₹{data.total}</p>
          <p className="text-xs opacity-60">Order ID: {data.orderId}</p>
        </div>,
        {
          style: {
            borderRadius: "14px",
            background: "#111827",
            color: "#fff",
          },
          autoClose: 5000,
        },
      );
    });

    return () => socket.disconnect();
  }, []);
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={5000} />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
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
