import apiClient from "./apiClient";

export const placeOrder = (data) => apiClient.post("/orders", data);

export const getMyOrders = () => apiClient.get("/orders/my");

export const getOrderById = (id) => apiClient.get(`/orders/${id}`);

export const getOrderRecommendations = () =>
  apiClient.get("/orders/recommendations");
