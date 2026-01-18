import axios from "axios";

export const getSections = async () => {
  const res = await axios.get("http://localhost:5000/api/sections");
  return res.data;
};
