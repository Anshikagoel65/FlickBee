import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE + "/api",
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && localStorage.getItem("token")) {
      localStorage.clear();
      window.dispatchEvent(new Event("logout"));
    }
    return Promise.reject(err);
  },
);

export default apiClient;
