import { useEffect, useState } from "react";
import { Upload, Pencil } from "lucide-react";
import { fetchCategories } from "../api/categoryApi";
import { createProduct, getProducts, updateProduct } from "../api/productApi";
import { deleteProduct } from "../api/productApi";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [allProducts, setAllProducts] = useState([]); // master list
  const [search, setSearch] = useState(""); // search text

  /* ================= LOAD DATA ON PAGE LOAD ================= */

  const loadCategories = async () => {
    try {
      const res = await fetchCategories();
      setCategories(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadProducts = async () => {
    try {
      const res = await getProducts();
      setAllProducts(res.data || []);
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const init = async () => {
      await loadCategories();
      await loadProducts();
    };

    init();
  }, []);

  /* ================= IMAGE HANDLER ================= */
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  /* ================= EDIT PRODUCT ================= */
  const editProduct = (p) => {
    setEditingId(p._id);
    setName(p.name);
    setPrice(p.price);
    setQuantity(p.quantity);
    setCategory(p.category);
    setPreview(`http://localhost:5000${p.image}`);
    setImage(null);
  };

  /* ================= SAVE PRODUCT ================= */
  const saveProduct = async () => {
    if (!name || !price || !quantity || !category) {
      alert("Fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("quantity", quantity);
    formData.append("category", category);

    if (image) {
      formData.append("image", image);
    }

    try {
      if (editingId) {
        await updateProduct(editingId, formData);
      } else {
        if (!image) {
          alert("Image is required");
          return;
        }
        await createProduct(formData);
      }

      resetForm();
      loadProducts(); // ✅ REFRESH PRODUCTS AFTER SAVE
    } catch (err) {
      console.error("Failed to save product", err);
    }
  };

  /* ================= RESET FORM ================= */
  const resetForm = () => {
    setEditingId(null);
    setName("");
    setPrice("");
    setQuantity("");
    setCategory("");
    setImage(null);
    setPreview(null);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await deleteProduct(id);
      loadProducts(); // 🔥 refresh list after delete
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleSearch = (value) => {
    setSearch(value);

    if (value.trim() === "") {
      // 🔥 if search cleared, show all products again
      setProducts(allProducts);
      return;
    }

    const filteredProducts = allProducts.filter((product) =>
      product.name.toLowerCase().includes(value.toLowerCase())
    );

    setProducts(filteredProducts);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Products</h1>

      {/* ================= FORM ================= */}
      <div className="bg-white p-6 rounded-xl shadow mb-10 max-w-xl">
        <h2 className="font-semibold mb-4">
          {editingId ? "Edit Product" : "Add Product"}
        </h2>

        <input
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border w-full mb-3 px-3 py-2 rounded"
        />

        <input
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border w-full mb-3 px-3 py-2 rounded"
        />

        <input
          placeholder="Quantity (e.g. 500 ml)"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="border w-full mb-3 px-3 py-2 rounded"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border px-3 py-2 w-full mb-4 rounded"
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <label className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center cursor-pointer text-gray-500 mb-4">
          <Upload />
          <span className="text-sm mt-2">
            {editingId ? "Change image (optional)" : "Upload product image"}
          </span>
          <input type="file" accept="image/*" hidden onChange={handleImage} />
        </label>

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="h-28 w-28 object-cover rounded mb-4"
          />
        )}

        <div className="flex gap-3">
          <button
            onClick={saveProduct}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {editingId ? "Update Product" : "Save Product"}
          </button>

          {editingId && (
            <button onClick={resetForm} className="border px-4 py-2 rounded">
              Cancel
            </button>
          )}
        </div>
      </div>
      <input
        type="text"
        placeholder="Search product..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        className="border px-4 py-2 mb-6 w-full rounded"
      />

      {/* ================= PRODUCT LIST ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p._id} className="bg-white p-3 rounded-xl shadow">
            <img
              src={`http://localhost:5000${p.image}`}
              alt={p.name}
              className="h-40 w-full object-cover rounded"
            />

            <div className="mt-2">
              <p className="font-semibold">{p.name}</p>
              <p className="text-sm text-gray-500">
                ₹{p.price} · {p.quantity}
              </p>
            </div>

            <div className="flex gap-3 mt-2">
              <button
                onClick={() => editProduct(p)}
                className="flex items-center gap-1 text-green-600 text-sm"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(p._id)}
                className="text-red-600 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
