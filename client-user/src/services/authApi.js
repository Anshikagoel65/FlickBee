import apiClient from "./apiClient";

export const sendOtp = async (phone) => {
  const res = await apiClient.post("/auth/send-otp", { phone });
  return res.data;
};

export const verifyOtp = async (phone, otp) => {
  const res = await apiClient.post("/auth/verify-otp", { phone, otp });
  return res.data;
};
