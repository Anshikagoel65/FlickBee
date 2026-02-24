import { createContext, useContext, useEffect, useRef, useState } from "react";
import publicAPI from "../api/publicAxios";
import toast from "react-hot-toast";

const OrderNotificationContext = createContext();

export const OrderNotificationProvider = ({ children }) => {
  const [hasNewOrder, setHasNewOrder] = useState(false);

  const previousCount = useRef(0);
  const isFirstLoad = useRef(true);

  const checkForNewOrders = async () => {
    try {
      const res = await publicAPI.get("/admin/orders-count");
      const currentCount = res.data.count;
      if (isFirstLoad.current) {
        previousCount.current = currentCount;
        isFirstLoad.current = false;
      } else if (currentCount > previousCount.current) {
        toast.success("🛒 New order received!");
        setHasNewOrder(true);
        previousCount.current = currentCount;
      }
    } catch (err) {
      console.log("Polling error FULL:", err.response?.data || err);
    }
  };

  useEffect(() => {
    checkForNewOrders();
    const interval = setInterval(checkForNewOrders, 10000); // 10 sec
    return () => clearInterval(interval);
  }, []);

  return (
    <OrderNotificationContext.Provider value={{ hasNewOrder, setHasNewOrder }}>
      {children}
    </OrderNotificationContext.Provider>
  );
};

export const useOrderNotification = () => useContext(OrderNotificationContext);
