import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({});

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev[product.id];

      return {
        ...prev,
        [product.id]: {
          ...product,
          cartQty: existing ? existing.cartQty + 1 : 1,
        },
      };
    });
  };

  const removeFromCart = (product) => {
    setCart((prev) => {
      const existing = prev[product.id];
      if (!existing) return prev;

      if (existing.cartQty === 1) {
        const updated = { ...prev };
        delete updated[product.id];
        return updated;
      }

      return {
        ...prev,
        [product.id]: {
          ...existing,
          cartQty: existing.cartQty - 1,
        },
      };
    });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
