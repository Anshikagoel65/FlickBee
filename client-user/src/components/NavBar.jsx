import React, { useState, useRef, useEffect } from "react";
import { Search, MapPin, ChevronDown, User, ShoppingCart } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

import LocationModal from "./LocationModal";
import LoginModal from "./LoginModal";
import CartDrawer from "./CartDrawer";

import { useLocationContext } from "../context/LocationContext";
import { useAuthContext } from "../context/AuthContext";
import { useSearch } from "../context/SearchContext";
import { useCart } from "../context/CartContext";

const NavBar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const isSearchPage = location.pathname === "/search";

  const { searchQuery, setSearchQuery } = useSearch();
  const { addRecentSearch } = useSearch();
  const { cart } = useCart();
  const accountRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const cartItems = Object.values(cart);

  const cartCount = cartItems.reduce((sum, item) => sum + item.cartQty, 0);

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.cartQty,
    0
  );

  const { address, deliveryTime, setIsModalOpen, isModalOpen } =
    useLocationContext();
  const { isLoginOpen, setIsLoginOpen, user, logout } = useAuthContext();
  const [accountOpen, setAccountOpen] = useState(false);

  const showDeliveryTime = !!address;

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
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
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <ShoppingCart size={25} />

              {cartCount > 0 && (
                <div className="flex flex-col items-end leading-tight">
                  <span className="text-sm font-bold">{cartCount} items</span>
                  <span className="text-xs font-bold">₹{cartTotal}</span>
                </div>
              )}
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
              {/* 🔐 LOGIN / ACCOUNT */}
              {!user && (
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="text-gray-700 text-xl font-medium"
                >
                  Login
                </button>
              )}

              {/* ✅ ACCOUNT DROPDOWN */}
              {user && (
                <div ref={accountRef} className="relative">
                  <button
                    onClick={() => setAccountOpen((prev) => !prev)}
                    className="flex items-center gap-2 text-gray-700 text-xl font-medium"
                  >
                    Account
                    <ChevronDown size={18} />
                  </button>
                  {accountOpen && (
                    <div className="absolute right-0 top-14 w-56 bg-white border rounded-xl shadow-lg z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b bg-gray-50">
                        <p className="text-base font-bold text-gray-500">
                          My Account
                        </p>
                        <p className="font-semibold text-sm text-gray-500">
                          {user.phone}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          navigate("/account/orders");
                          setAccountOpen(false);
                        }}
                        className="block w-full text-left text-sm text-gray-600 px-4 py-3 hover:bg-gray-100"
                      >
                        My Orders
                      </button>

                      <button
                        onClick={() => {
                          navigate("/account/addresses");
                          setAccountOpen(false);
                        }}
                        className="block w-full text-left text-sm text-gray-600 px-4 py-3 hover:bg-gray-100"
                      >
                        Saved Addresses
                      </button>

                      <button
                        onClick={() => {
                          logout();
                          setAccountOpen(false);
                        }}
                        className="block w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-100"
                      >
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              )}
              <button
                onClick={() => setIsCartOpen(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <ShoppingCart size={25} />

                {cartCount > 0 && (
                  <div className="flex flex-col items-end leading-tight">
                    <span className="text-sm font-bold">{cartCount} items</span>
                    <span className="text-sm font-bold">₹{cartTotal}</span>
                  </div>
                )}
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
              onClick={() => {
                if (!user) {
                  setIsLoginOpen(true);
                } else {
                  navigate("/account/mobile");
                }
              }}
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
