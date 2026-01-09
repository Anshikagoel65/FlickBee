import { useState, useEffect } from "react";
import { Plus, Upload } from "lucide-react";
import {
  fetchCategories,
  createCategory,
  deleteCategoryById,
  updateCategory,
} from "../api/categoryApi";

const Categories = () => {
  const [categories, setCategories] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // 🔹 Load categories (reusable)
  const loadCategories = async () => {
    try {
      const res = await fetchCategories();
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  // 🔹 Load on mount (React-18 safe)
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const res = await fetchCategories();
        if (isMounted) {
          setCategories(res.data);
        }
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // Save category (ADD only – backend)
  const saveCategory = async () => {
    if (!name) return;

    const formData = new FormData();
    formData.append("name", name);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      if (editingId) {
        // EDIT MODE
        await updateCategory(editingId, formData);
      } else {
        // ADD MODE
        if (!imageFile) return;
        await createCategory(formData);
      }

      await loadCategories();
      resetForm();
    } catch (err) {
      console.error("Failed to save category", err);
    }
  };

  // Open edit form (UI only for now)
  const editCategory = (cat) => {
    setName(cat.name);
    setPreview(`http://localhost:5000${cat.image}`);
    setImageFile(null);
    setEditingId(cat._id);
    setShowForm(true);
  };

  // Delete category
  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await deleteCategoryById(id);
      await loadCategories();
    } catch (err) {
      console.error("Failed to delete category", err);
    }
  };

  // Reset form
  const resetForm = () => {
    setName("");
    setImageFile(null);
    setPreview(null);
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div>
      {/* Header */}
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

      {/* Form */}
      {showForm && (
        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              <p className="text-sm font-medium mb-2">Preview</p>
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

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <p className="text-gray-500">No categories added yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div key={cat._id} className="bg-white rounded-xl shadow p-3">
              <img
                src={`http://localhost:5000${cat.image}`}
                alt={cat.name}
                className="h-32 w-full object-cover rounded-lg"
              />

              <div className="mt-3">
                <p className="font-semibold">{cat.name}</p>
                <p className="text-sm text-green-600">Active</p>

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
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
