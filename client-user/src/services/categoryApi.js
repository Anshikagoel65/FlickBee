import axios from "axios";

export const fetchUserCategories = axios.create({
  baseURL: "http://localhost:5000/api/categories",
});
