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
    const variant =
      product.selectedVariant ||
      product.variants?.find((v) => v.isDefault) ||
      product.variants?.[0];

    if (!variant) return;

    const cartKey = `${product._id}_${variant._id}`;

    setCart((prev) => {
      const existing = prev[cartKey];

      return {
        ...prev,
        [cartKey]: {
          id: cartKey,
          productId: product._id,
          variantId: variant._id,
          name: product.name,
          thumbnail: product.thumbnail,
          price: variant.price,
          mrp: variant.mrp,
          quantity: variant.quantity,
          unit: variant.unit,
          cartQty: existing ? existing.cartQty + 1 : 1,
        },
      };
    });
  };

  const removeFromCart = (item) => {
    setCart((prev) => {
      const existing = prev[item.id];
      if (!existing) return prev;

      if (existing.cartQty === 1) {
        const updated = { ...prev };
        delete updated[item.id];
        return updated;
      }

      return {
        ...prev,
        [item.id]: {
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
