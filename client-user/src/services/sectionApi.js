import axios from "axios";

export const getSections = async () => {
  const res = await axios.get("http://localhost:5000/api/admin/sections");

  // normalize product ids for cart
  return res.data.map((sec) => ({
    ...sec,
    products: sec.products.map((p) => ({
      ...p,
      id: p._id,
    })),
  }));
};
