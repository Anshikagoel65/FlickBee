import axios from "axios";

const API_URL = "http://localhost:5000/api/admin/categories";

// GET all categories
export const fetchCategories = () => axios.get(API_URL);

// CREATE category
export const createCategory = (formData) =>
  axios.post(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// DELETE category
export const deleteCategoryById = (id) => axios.delete(`${API_URL}/${id}`);

// UPDATE category
export const updateCategory = (id, formData) =>
  axios.put(`${API_URL}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
