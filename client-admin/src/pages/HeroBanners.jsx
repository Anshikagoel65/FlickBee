"use client";
import { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const SERVER_URL = import.meta.env.VITE_SOCKET_URL;
const HeroBanners = () => {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [banners, setBanners] = useState([]);
  const fetchBanners = async () => {
    try {
      const res = await fetch(`${API_BASE}/banners`);
      const data = await res.json();
      setBanners(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this banner?",
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_BASE}/banners/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("Delete failed");
        return;
      }

      fetchBanners();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async () => {
    if (!image) return alert("Please select image");

    const formData = new FormData();
    formData.append("banner", image);

    try {
      const res = await fetch(`${API_BASE}/banners`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        alert("Upload failed");
        return;
      }

      setOpen(false);
      setImage(null);
      fetchBanners();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Hero Banners</h1>
        <button
          onClick={() => setOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Banner
        </button>
      </div>

      {banners.length === 0 ? (
        <div className="bg-white p-4 rounded text-gray-500">
          No banners added yet
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {banners.map((banner) => (
            <div key={banner._id} className="relative group">
              <img
                src={`${SERVER_URL}/uploads/${banner.image}`}
                className="w-full h-40 object-cover rounded"
              />
              <button
                onClick={() => handleDelete(banner._id)}
                className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-sm rounded opacity-0 group-hover:opacity-100 transition"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-lg font-semibold mb-4">Upload Banner</h2>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleUpload}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroBanners;
