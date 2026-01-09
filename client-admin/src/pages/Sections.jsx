import { useEffect, useState } from "react";
import {
  fetchSections,
  createSection,
  deleteSection,
  updateSection,
} from "../api/sectionApi";
import { fetchCategories } from "../api/categoryApi";
import { getProducts } from "../api/productApi";

const Sections = () => {
  const [sections, setSections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);

  const [loadingProducts, setLoadingProducts] = useState(false);
  const [editingId, setEditingId] = useState(null);

  /* ================= LOAD INITIAL DATA ================= */
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const secRes = await fetchSections();
      const catRes = await fetchCategories();

      // 🔥 FIX: use .data safely
      setSections(secRes?.data || []);
      setCategories(catRes?.data || []);
    } catch (err) {
      console.error("Failed to load initial data", err);
    }
  };

  /* ================= LOAD PRODUCTS BY CATEGORY ================= */
  const loadProductsByCategory = async (categoryId) => {
    if (!categoryId) return;

    try {
      setLoadingProducts(true);
      const prodRes = await getProducts(categoryId);

      // 🔥 FIX: API returns { data }
      setProducts(prodRes?.data || []);
    } catch (err) {
      console.error("Failed to load products", err);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  /* ================= TOGGLE PRODUCT ================= */
  const toggleProduct = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  /* ================= SAVE SECTION ================= */
  const saveSection = async () => {
    if (!title.trim()) {
      alert("Enter section title");
      return;
    }

    if (!category) {
      alert("Select a category");
      return;
    }

    if (selectedProducts.length === 0) {
      alert("Select at least one product");
      return;
    }

    try {
      if (editingId) {
        await updateSection(editingId, {
          title: title.trim(),
          category,
          products: selectedProducts,
        });
      } else {
        await createSection({
          title: title.trim(),
          category,
          products: selectedProducts,
        });
      }

      resetForm();
      loadInitialData();
    } catch (err) {
      console.error("Failed to create section", err);
      alert("Failed to save section");
    }
  };

  /* ================= RESET FORM ================= */
  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setCategory("");
    setProducts([]);
    setSelectedProducts([]);
  };

  /* ================= DELETE SECTION ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this section?")) return;

    try {
      await deleteSection(id);
      loadInitialData(); // 🔥 FIX: refresh UI
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleEdit = (section) => {
    setEditingId(section._id);
    setTitle(section.title);
    setCategory(section.category._id);

    // load products of this category
    loadProductsByCategory(section.category._id);

    // pre-select products
    setSelectedProducts(section.products.map((p) => p._id));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Sections</h1>

      {/* ================= CREATE FORM ================= */}
      <div className="bg-white p-4 rounded-xl mb-8 shadow">
        <input
          placeholder="Section title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border px-3 py-2 w-full mb-4 rounded"
        />

        <select
          value={category}
          onChange={(e) => {
            const value = e.target.value;
            setCategory(value);
            setSelectedProducts([]);
            loadProductsByCategory(value);
          }}
          className="border px-3 py-2 w-full mb-4 rounded"
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* ================= PRODUCTS ================= */}
        {loadingProducts && (
          <p className="text-sm text-gray-500">Loading products…</p>
        )}

        {!loadingProducts && products.length > 0 && (
          <>
            <p className="font-semibold mb-2">Select Products</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto">
              {products.map((p) => (
                <label
                  key={p._id}
                  className={`border rounded-lg p-2 cursor-pointer flex gap-2 items-center ${
                    selectedProducts.includes(p._id)
                      ? "border-green-600 bg-green-50"
                      : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(p._id)}
                    onChange={() => toggleProduct(p._id)}
                  />
                  <span className="text-sm">{p.name}</span>
                </label>
              ))}
            </div>
          </>
        )}

        <button
          onClick={saveSection}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
        >
          Save Section
        </button>
      </div>

      {/* ================= SECTION LIST ================= */}
      <div className="grid gap-4">
        {sections.length === 0 ? (
          <p className="text-gray-500">No sections created yet.</p>
        ) : (
          sections.map((s) => (
            <div
              key={s._id}
              className="bg-white p-4 rounded-xl flex justify-between items-center shadow"
            >
              <div>
                <p className="font-bold">{s.title}</p>
                <p className="text-sm text-gray-500 mb-1">
                  Category: {s.category?.name}
                </p>

                <p className="text-sm">
                  Products:
                  {s.products.length === 0 ? (
                    " —"
                  ) : (
                    <span className="ml-1 text-gray-600">
                      {s.products.map((p) => p.name).join(", ")}
                    </span>
                  )}
                </p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => handleEdit(s)} className="text-blue-600">
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(s._id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sections;
