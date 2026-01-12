import axios from "axios";

const API_URL = "http://localhost:5000/api/admin/categories";

export const fetchCategories = () => axios.get(API_URL);

export const createCategory = (formData) =>
  axios.post(API_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateCategory = (id, formData) =>
  axios.put(`${API_URL}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteCategoryById = (id) => axios.delete(`${API_URL}/${id}`);
