import API from "./axios";

export const createProduct = async (formData) => {
  try {
    const res = await API.post("/admin/products", formData, {
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

export const getProducts = async (filters = {}) => {
  try {
    const params = new URLSearchParams();

    if (filters.category) params.append("category", filters.category);
    if (filters.status) params.append("status", filters.status);
    if (filters.search) params.append("search", filters.search);

    const res = await API.get(
      `/admin/products${params.toString() ? `?${params}` : ""}`,
    );

    return res.data;
  } catch (error) {
    console.error("Get Products API Error:", error);
    throw error.response?.data || error;
  }
};

export const updateProduct = async (id, formData) => {
  try {
    const res = await API.put(`/admin/products/${id}`, formData, {
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

export const deleteProduct = async (id) => {
  try {
    const res = await API.delete(`/admin/products/${id}`);
    return res.data;
  } catch (error) {
    console.error("Delete Product API Error:", error);
    throw error.response?.data || error;
  }
};
