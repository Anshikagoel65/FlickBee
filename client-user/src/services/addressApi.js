import apiClient from "./apiClient";

// ✅ MUST MATCH BACKEND ROUTES
export const getAddresses = () => apiClient.get("/address");

export const addAddress = (data) =>
  apiClient.post("/address", {
    name: data.name,
    phone: data.phone,

    houseNo: data.houseNo,
    street1: data.street1,
    street2: data.street2,

    city: data.city,
    state: data.state,
    postalCode: data.postalCode,

    latitude: data.latitude,
    longitude: data.longitude,

    type: data.type,
    isDefault: data.isDefault,
  });

export const updateAddress = (id, data) =>
  apiClient.put(`/address/${id}`, {
    name: data.name,
    phone: data.phone,

    houseNo: data.houseNo,
    street1: data.street1,
    street2: data.street2,

    city: data.city,
    state: data.state,
    postalCode: data.postalCode,

    latitude: data.latitude,
    longitude: data.longitude,

    type: data.type,
    isDefault: data.isDefault,
  });

export const deleteAddress = (id) => apiClient.delete(`/address/${id}`);
