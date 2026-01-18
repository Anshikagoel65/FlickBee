import axios from "axios";

const API = "http://localhost:5000/api";

export const getProducts = async () => {
  const res = await axios.get(`${API}/products`);
  return res.data;
};
