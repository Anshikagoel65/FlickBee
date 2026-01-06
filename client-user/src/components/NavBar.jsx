import React, { useState } from "react";
import { Search, MapPin, ChevronDown, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

import LocationModal from "./LocationModal";
import LoginModal from "./LoginModal";
import CartDrawer from "./CartDrawer";

import { useLocationContext } from "../context/LocationContext";
import { useAuthContext } from "../context/AuthContext";
import { useSearch } from "../context/SearchContext";

const NavBar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const isSearchPage = location.pathname === "/search";

  const { searchQuery, setSearchQuery } = useSearch();
  const { addRecentSearch } = useSearch();

  const { address, deliveryTime, setIsModalOpen, isModalOpen } =
    useLocationContext();
  const { isLoginOpen, setIsLoginOpen } = useAuthContext();

  const showDeliveryTime = !!address;

  return (
    <>
      <nav className="w-full bg-white shadow-md z-50">
        {/* ================= DESKTOP ================= */}
        {isSearchPage ? (
          /* 🔍 SEARCH PAGE – DESKTOP ONLY */
          <div className="hidden md:flex items-center gap-8 px-4 h-16 max-w-[1400px] mx-auto">
            {/* Logo */}
            <h1
              onClick={() => navigate("/")}
              className="text-4xl font-extrabold text-green-600 cursor-pointer"
            >
              Flick<span className="text-black">Bee</span>
            </h1>

            {/* Search */}
            <div className="flex-1 relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (location.pathname !== "/search") {
                    navigate("/search");
                  }
                }}
                onBlur={() => addRecentSearch(searchQuery)}
                placeholder="Search for products..."
                className="w-full bg-gray-50 pl-10 pr-4 py-2 border rounded-lg focus:outline-none"
              />
            </div>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Cart
            </button>
          </div>
        ) : (
          /* 🏠 HOME – DESKTOP */
          <div className="hidden md:flex items-center justify-between px-8 h-20">
            {/* Left */}
            <div className="flex items-center gap-14">
              <h1 className="text-4xl font-extrabold text-green-600">
                Flick<span className="text-black">Bee</span>
              </h1>

              <div
                className="cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              >
                {showDeliveryTime && (
                  <p className="text-lg font-bold">
                    Delivery in {deliveryTime} minutes
                  </p>
                )}
                <div className="flex items-center gap-1 text-gray-700">
                  <MapPin size={18} />
                  <span className="underline decoration-dotted max-w-[220px] truncate">
                    {address || "Detect location"}
                  </span>
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-[700px] mx-10 relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (location.pathname !== "/search") {
                    navigate("/search");
                  }
                }}
                onBlur={() => addRecentSearch(searchQuery)}
                placeholder="Search for products..."
                className="w-full bg-gray-50 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>

            {/* Right */}
            <div className="flex items-center gap-10">
              <button
                onClick={() => setIsLoginOpen(true)}
                className="text-gray-700 text-lg font-medium"
              >
                Login
              </button>

              <button
                onClick={() => setIsCartOpen(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Cart
              </button>
            </div>
          </div>
        )}

        {/* ================= MOBILE (SAME FOR ALL PAGES) ================= */}
        <div className="md:hidden px-4 py-3">
          {/* Top Row */}
          <div className="flex items-center justify-between">
            <div
              className="cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              <p className="text-sm font-semibold">
                {showDeliveryTime
                  ? `Delivery in ${deliveryTime} minutes`
                  : "Currently unavailable"}
              </p>

              <div className="flex items-center gap-1 text-xs text-gray-600 truncate">
                <MapPin size={14} />
                <span>{address || "Detect location"}</span>
                <ChevronDown size={14} />
              </div>
            </div>

            <button
              onClick={() => setIsLoginOpen(true)}
              className="text-gray-700"
            >
              <User />
            </button>
          </div>

          {/* Search Bar */}
          <div className="mt-3 relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (location.pathname !== "/search") {
                  navigate("/search");
                }
              }}
              onBlur={() => addRecentSearch(searchQuery)}
              placeholder="Search for products"
              className="w-full bg-gray-50 pl-10 pr-4 py-2 border rounded-lg focus:outline-none"
            />
          </div>
        </div>
      </nav>

      {/* Modals */}
      {isModalOpen && <LocationModal />}
      {isLoginOpen && <LoginModal />}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default NavBar;
