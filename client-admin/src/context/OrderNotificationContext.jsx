import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

const OrderNotificationContext = createContext();

export const OrderNotificationProvider = ({ children }) => {
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const audioRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio("/notification.mp3");
    audioRef.current.preload = "auto";
    audioRef.current.volume = 1;
    const unlockAudio = () => {
      if (audioRef.current) {
        audioRef.current
          .play()
          .then(() => {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          })
          .catch(() => {});
      }
      window.removeEventListener("click", unlockAudio);
    };

    window.addEventListener("click", unlockAudio);
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket"],
    });
    socketRef.current.on("connect", () => {
      console.log("✅ Socket connected");
    });

    socketRef.current.on("new-order", (data) => {
      setNewOrdersCount((prev) => prev + 1);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((err) => {
          console.log("Audio blocked:", err);
        });
      }

      toast.success(`🛒 New Order ₹${data.total} received`);
    });
    socketRef.current.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return (
    <OrderNotificationContext.Provider
      value={{ newOrdersCount, setNewOrdersCount }}
    >
      {children}
    </OrderNotificationContext.Provider>
  );
};

export const useOrderNotification = () => useContext(OrderNotificationContext);
