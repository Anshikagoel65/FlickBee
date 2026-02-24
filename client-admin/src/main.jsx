import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { OrderNotificationProvider } from "./context/OrderNotificationContext";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <OrderNotificationProvider>
    <StrictMode>
      <Toaster position="top-right" />
      <App />
    </StrictMode>
  </OrderNotificationProvider>,
);
