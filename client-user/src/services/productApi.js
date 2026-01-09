import axios from "axios";

const API = "http://localhost:5000/api";

/**
 * Fetch products grouped by category
 * [
 *   { category: {...}, products: [...] },
 *   { category: {...}, products: [...] }
 * ]
 */
export const getProductsByCategory = async () => {
  const res = await axios.get(`${API}/products/by-category`);
  return res.data;
};

export const getProducts = async () => {
  const res = await axios.get("http://localhost:5000/api/products");
  return res.data;
};
