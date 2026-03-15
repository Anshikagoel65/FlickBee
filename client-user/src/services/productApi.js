import apiClient from "./apiClient";

export const getProducts = async () => {
  const res = await apiClient.get("/products");
  return res.data;
};

export const getProductById = async (id) => {
  const res = await apiClient.get(`/products/${id}`);
  return res.data;
};

export const getSimilarProducts = (id) =>
  apiClient.get(`/products/similar/${id}`).then((res) => res.data);
