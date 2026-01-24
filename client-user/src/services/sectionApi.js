import apiClient from "./apiClient";

export const getSections = async () => {
  const res = await apiClient.get("/sections");
  return res.data;
};
