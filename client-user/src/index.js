import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { LocationProvider } from "./context/LocationContext";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { SearchProvider } from "./context/SearchContext";
import { AddressDrawerProvider } from "./context/AddressDrawerContext";
import { WishlistProvider } from "./context/WishlistContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AddressDrawerProvider>
      <AuthProvider>
        <LocationProvider>
          <WishlistProvider>
            <CartProvider>
              <SearchProvider>
                <App />
              </SearchProvider>
            </CartProvider>
          </WishlistProvider>
        </LocationProvider>
      </AuthProvider>
    </AddressDrawerProvider>
  </React.StrictMode>,
);
