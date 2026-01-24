import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : {};
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev[product._id];

      return {
        ...prev,
        [product._id]: {
          ...product,
          cartQty: existing ? existing.cartQty + 1 : 1,
        },
      };
    });
  };

  const removeFromCart = (product) => {
    setCart((prev) => {
      const existing = prev[product._id];
      if (!existing) return prev;

      if (existing.cartQty === 1) {
        const updated = { ...prev };
        delete updated[product._id];
        return updated;
      }

      return {
        ...prev,
        [product._id]: {
          ...existing,
          cartQty: existing.cartQty - 1,
        },
      };
    });
  };

  const clearCart = () => {
    setCart({});
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
