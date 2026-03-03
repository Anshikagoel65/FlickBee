import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

const OrderNotificationContext = createContext();

export const OrderNotificationProvider = ({ children }) => {
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    // 🔔 Create and preload audio
    audioRef.current = new Audio("/notification.mp3");
    audioRef.current.preload = "auto";
    audioRef.current.volume = 1;

    // 🔓 Unlock audio on first user interaction (VERY IMPORTANT)
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

    const socket = io("http://localhost:5000", {
      transports: ["websocket"],
    });

    socket.on("new-order", (data) => {
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

    return () => {
      socket.disconnect();
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
