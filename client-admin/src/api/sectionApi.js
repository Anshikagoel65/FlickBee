import API from "./axios";

export const fetchSections = () => API.get("/admin/sections");

export const createSection = (data) => API.post("/admin/sections", data);

export const updateSection = (id, data) =>
  API.put(`/admin/sections/${id}`, data);

export const deleteSection = (id) => API.delete(`/admin/sections/${id}`);
