import API from "./api";

// ✅ MUST MATCH BACKEND ROUTES
export const getAddresses = () => API.get("/address");

export const addAddress = (data) =>
  API.post("/address", {
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
  API.put(`/address/${id}`, {
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

export const deleteAddress = (id) => API.delete(`/address/${id}`);
