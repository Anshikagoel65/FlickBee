import { useState, useEffect } from "react";
import { Plus, Upload } from "lucide-react";
import {
  fetchCategories,
  createCategory,
  deleteCategoryById,
  updateCategory,
} from "../api/categoryApi";

/* 🔹 helper: generate slug */
const generateSlug = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const Categories = () => {
  const [categories, setCategories] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [order, setOrder] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  /* ✅ LOAD CATEGORIES */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchCategories();
        setCategories(res.data || []);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };

    fetchData();
  }, []);

  /* 🔹 image upload */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  /* 🔹 save category */
  const saveCategory = async () => {
    if (!name || !slug) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("order", order);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      if (editingId) {
        await updateCategory(editingId, formData);
      } else {
        if (!imageFile) return;
        await createCategory(formData);
      }

      const res = await fetchCategories();
      setCategories(res.data || []);
      resetForm();
    } catch (err) {
      console.error("Failed to save category", err);
    }
  };

  /* 🔹 edit */
  const editCategory = (cat) => {
    setName(cat.name);
    setSlug(cat.slug);
    setOrder(cat.order || 0);
    setPreview(cat.image ? `http://localhost:5000${cat.image}` : null);
    setImageFile(null);
    setEditingId(cat._id);
    setShowForm(true);
  };

  /* 🔹 delete */
  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await deleteCategoryById(id);
      const res = await fetchCategories();
      setCategories(res.data || []);
    } catch (err) {
      console.error("Failed to delete category", err);
    }
  };

  /* 🔹 reset */
  const resetForm = () => {
    setName("");
    setSlug("");
    setOrder(0);
    setImageFile(null);
    setPreview(null);
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Category name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSlug(generateSlug(e.target.value));
              }}
              className="border rounded-lg px-3 py-2"
            />

            <input
              type="text"
              placeholder="Slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="border rounded-lg px-3 py-2"
            />

            <input
              type="number"
              placeholder="Display order"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="border rounded-lg px-3 py-2"
            />

            <label className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer text-gray-500 hover:border-green-500">
              <Upload />
              <span className="text-sm mt-2">Upload category image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {preview && (
            <div className="mt-4">
              <img
                src={preview}
                alt="Preview"
                className="h-32 w-32 object-cover rounded-lg border"
              />
            </div>
          )}

          <div className="flex gap-3 mt-4">
            <button
              onClick={saveCategory}
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              {editingId ? "Update" : "Save"}
            </button>

            <button onClick={resetForm} className="border px-4 py-2 rounded-lg">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* GRID */}
      {categories.length === 0 ? (
        <p className="text-gray-500">No categories added yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            console.log("IMAGE PATH:", cat.image);

            return (
              <div key={cat._id} className="bg-white rounded-xl shadow p-3">
                {cat.image && (
                  <img
                    src={`http://localhost:5000${cat.image}`}
                    alt={cat.name}
                    className="h-32 w-full object-cover rounded-lg"
                  />
                )}

                <div className="mt-3">
                  <p className="font-semibold">{cat.name}</p>
                  <p className="text-xs text-gray-500">{cat.slug}</p>

                  <p
                    className={`text-sm ${
                      cat.isActive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {cat.isActive ? "Active" : "Inactive"}
                  </p>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => editCategory(cat)}
                      className="flex-1 border rounded-lg py-1 text-sm hover:bg-gray-100"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteCategory(cat._id)}
                      className="flex-1 border rounded-lg py-1 text-sm text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Categories;
