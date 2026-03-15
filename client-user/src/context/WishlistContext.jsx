import { createContext, useContext, useEffect, useState } from "react";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (product) => {
    setWishlist((prev) => ({
      ...prev,
      [product._id]: product,
    }));
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => {
      const updated = { ...prev };
      delete updated[productId];
      return updated;
    });
  };

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      if (prev[product._id]) {
        const updated = { ...prev };
        delete updated[product._id];
        return updated;
      }
      return {
        ...prev,
        [product._id]: product,
      };
    });
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, toggleWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
