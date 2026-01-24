import apiClient from "./apiClient";

export const getProducts = async () => {
  const res = await apiClient.get("/products");
  return res.data;
};

export const getProductById = async (id) => {
  const res = await apiClient.get(`/products/${id}`);
  return res.data;
};
