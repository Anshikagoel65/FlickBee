import apiClient from "./apiClient";

export const fetchUserCategories = () => apiClient.get("/categories");
