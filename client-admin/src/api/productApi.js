import axios from "axios";

const BASE = "http://localhost:5000/api/admin/products";

export const createProduct = async (formData) => {
  const res = await axios.post(BASE, formData);
  return res.data;
};

export const getProducts = (category) => {
  let url = "http://localhost:5000/api/admin/products";

  if (category) {
    url += `?category=${category}`;
  }

  return axios.get(url);
};

export const updateProduct = async (id, formData) => {
  const res = await axios.put(`${BASE}/${id}`, formData);
  return res.data;
};

export const deleteProduct = (id) => {
  return axios.delete(`http://localhost:5000/api/admin/products/${id}`);
};
