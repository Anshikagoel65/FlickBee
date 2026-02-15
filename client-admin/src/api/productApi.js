import axios from "axios";

/* ================= BASE CONFIG ================= */

// Use environment variable in production
const API_BASE = "http://localhost:5000/api";

const ADMIN_BASE = `${API_BASE}/admin/products`;

/* ================= CREATE ================= */

export const createProduct = async (formData) => {
  try {
    const res = await axios.post(ADMIN_BASE, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error) {
    console.error("Create Product API Error:", error);
    throw error.response?.data || error;
  }
};

/* ================= GET (ADMIN) ================= */

export const getProducts = async (filters = {}) => {
  try {
    const params = new URLSearchParams();

    if (filters.category) params.append("category", filters.category);
    if (filters.status) params.append("status", filters.status);
    if (filters.search) params.append("search", filters.search);

    const res = await axios.get(
      `${ADMIN_BASE}${params.toString() ? `?${params}` : ""}`,
    );

    return res;
  } catch (error) {
    console.error("Get Products API Error:", error);
    throw error.response?.data || error;
  }
};

/* ================= UPDATE ================= */

export const updateProduct = async (id, formData) => {
  try {
    const res = await axios.put(`${ADMIN_BASE}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error) {
    console.error("Update Product API Error:", error);
    throw error.response?.data || error;
  }
};

/* ================= DELETE ================= */

export const deleteProduct = async (id) => {
  try {
    const res = await axios.delete(`${ADMIN_BASE}/${id}`);
    return res.data;
  } catch (error) {
    console.error("Delete Product API Error:", error);
    throw error.response?.data || error;
  }
};
