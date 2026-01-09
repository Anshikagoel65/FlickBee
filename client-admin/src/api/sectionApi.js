import axios from "axios";

const API = "http://localhost:5000/api/admin";

export const fetchSections = () => axios.get(`${API}/sections`);

export const createSection = (data) => axios.post(`${API}/sections`, data);

export const updateSection = (id, data) =>
  axios.put(`${API}/sections/${id}`, data);

export const deleteSection = (id) => axios.delete(`${API}/sections/${id}`);
