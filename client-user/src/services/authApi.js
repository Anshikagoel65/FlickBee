import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // change if needed
});

export const sendOtp = (phone) => API.post("/auth/send-otp", { phone });

export const verifyOtp = (phone, otp) =>
  API.post("/auth/verify-otp", { phone, otp });

export default API;
