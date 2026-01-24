// context/DrawerContext.jsx
import { createContext, useContext, useState } from "react";

const AddressDrawerContext = createContext();

export const AddressDrawerProvider = ({ children }) => {
  const [drawerView, setDrawerView] = useState(null);
  // null | "cart" | "address-list" | "address-form"

  return (
    <AddressDrawerContext.Provider value={{ drawerView, setDrawerView }}>
      {children}
    </AddressDrawerContext.Provider>
  );
};

export const useDrawer = () => {
  const context = useContext(AddressDrawerContext);
  if (!context) {
    throw new Error("useDrawer must be used within DrawerProvider");
  }
  return context;
};
