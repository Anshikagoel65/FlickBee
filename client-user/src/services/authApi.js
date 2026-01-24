import apiClient from "./apiClient";

export const sendOtp = (phone) => apiClient.post("/auth/send-otp", { phone });

export const verifyOtp = (phone, otp) =>
  apiClient.post("/auth/verify-otp", { phone, otp });
