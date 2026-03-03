import API from "./axios";

const API_URL = "/admin/categories";

export const fetchCategories = () => API.get(API_URL);

export const createCategory = (formData) =>
  API.post(API_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateCategory = (id, formData) =>
  API.put(`${API_URL}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteCategoryById = (id) => API.delete(`${API_URL}/${id}`);
