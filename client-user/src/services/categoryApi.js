import apiClient from "./apiClient";

export const fetchUserCategories = apiClient.create({
  baseURL: "http://localhost:5000/api/categories",
});
