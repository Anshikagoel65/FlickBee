import axios from "axios";

export const fetchUserCategories = () =>
  axios.get("http://localhost:5000/api/categories");
