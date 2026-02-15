import { useEffect, useState } from "react";
import { Upload, Plus, Trash2 } from "lucide-react";
import { fetchCategories } from "../api/categoryApi";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../api/productApi";

const unitOptions = ["gram", "kg", "ml", "liter", "piece"];
const productTypes = [
  "grocery",
  "snacks",
  "beverages",
  "dairy",
  "fruits",
  "vegetables",
  "grains",
  "others",
];

const Products = () => {
  /* ================= STATES ================= */
  const [allProducts, setAllProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    brandName: "",
    category: "",
    productType: "",
    taxPercent: "",
  });

  const [variants, setVariants] = useState([
    { quantity: "", unit: "gram", price: "", mrp: "", stock: "" },
  ]);

  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);

  /* ================= LOAD ================= */

  useEffect(() => {
    const init = async () => {
      const [catRes, prodRes] = await Promise.all([
        fetchCategories(),
        getProducts(),
      ]);

      setCategories(catRes.data || []);
      setProducts(prodRes.data || []);
      setAllProducts(prodRes.data || []);
    };

    init();
  }, []);

  /* ================= IMAGE ================= */

  const handleImage = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreview(files.map((f) => URL.createObjectURL(f)));
  };

  /* ================= VARIANT ================= */

  const addVariant = () => {
    setVariants([
      ...variants,
      { quantity: "", unit: "gram", price: "", mrp: "", stock: "" },
    ]);
  };

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  /* ================= EDIT ================= */

  const editProduct = (p) => {
    setEditingId(p._id);

    setForm({
      name: p.name || "",
      description: p.description || "",
      brandName: p.brandName || "",
      category: p.category?._id || p.category || "",
      productType: p.productType || "",
      taxPercent: p.taxPercent?.toString() || "",
    });

    setVariants(
      Array.isArray(p.variants) && p.variants.length > 0
        ? p.variants.map((v) => ({
            quantity: v.quantity?.toString() || "",
            unit: v.unit,
            price: v.price?.toString() || "",
            mrp: v.mrp?.toString() || "",
            stock: v.stock?.toString() || "",
          }))
        : [{ quantity: "", unit: "gram", price: "", mrp: "", stock: "" }],
    );

    if (p.images?.length) {
      setPreview(p.images.map((img) => `http://localhost:5000${img}`));
    } else {
      setPreview([]);
    }

    setImages([]);
  };

  /* ================= SAVE ================= */

  const saveProduct = async () => {
    if (
      !form.name ||
      !form.description ||
      !form.category ||
      !form.productType ||
      variants.length === 0 ||
      (!editingId && images.length === 0)
    ) {
      alert("Fill required fields");
      return;
    }

    const cleanedVariants = variants.map((v) => ({
      quantity: Number(v.quantity) || 0,
      unit: v.unit,
      price: Number(v.price) || 0,
      mrp: Number(v.mrp) || 0,
      stock: Number(v.stock) || 0,
    }));

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("brandName", form.brandName); // optional
    formData.append("category", form.category);
    formData.append("productType", form.productType);
    formData.append("taxPercent", Number(form.taxPercent) || 0);
    formData.append("variants", JSON.stringify(cleanedVariants));

    images.forEach((img) => formData.append("images", img));

    try {
      if (editingId) {
        await updateProduct(editingId, formData);
      } else {
        await createProduct(formData);
      }

      resetForm();
      const res = await getProducts();
      setProducts(res.data || []);
      setAllProducts(res.data || []);
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  /* ================= RESET ================= */

  const resetForm = () => {
    setEditingId(null);
    setForm({
      name: "",
      description: "",
      brandName: "",
      category: "",
      productType: "",
      taxPercent: "",
    });

    setVariants([
      { quantity: "", unit: "gram", price: "", mrp: "", stock: "" },
    ]);

    setImages([]);
    setPreview([]);
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await deleteProduct(id);
    const res = await getProducts();
    setProducts(res.data || []);
    setAllProducts(res.data || []);
  };

  /* ================= SEARCH ================= */

  const handleSearch = (value) => {
    setSearch(value);

    if (!value.trim()) {
      setProducts(allProducts);
      return;
    }

    const filtered = allProducts.filter((p) =>
      p.name.toLowerCase().includes(value.toLowerCase()),
    );

    setProducts(filtered);
  };

  /* ================= UI ================= */

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Products</h1>

      {/* FORM */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <input
          placeholder="Enter product name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border w-full mb-3 p-2 rounded"
        />

        <textarea
          placeholder="Enter product description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border w-full mb-3 p-2 rounded"
        />

        <input
          placeholder="Brand name (optional)"
          value={form.brandName}
          onChange={(e) => setForm({ ...form, brandName: e.target.value })}
          className="border w-full mb-3 p-2 rounded"
        />

        <select
          value={form.productType}
          onChange={(e) => setForm({ ...form, productType: e.target.value })}
          className="border w-full mb-3 p-2 rounded"
        >
          <option value="">Select Product Type</option>
          {productTypes.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>

        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="border w-full mb-3 p-2 rounded"
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Tax % (optional)"
          value={form.taxPercent}
          onChange={(e) => setForm({ ...form, taxPercent: e.target.value })}
          className="border w-full mb-3 p-2 rounded"
        />
      </div>

      {/* VARIANTS */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <div className="flex justify-between mb-4">
          <h2 className="font-semibold">Variants</h2>
          <button
            onClick={addVariant}
            className="flex items-center gap-2 text-blue-600"
          >
            <Plus size={16} /> Add Variant
          </button>
        </div>

        {variants.map((v, i) => (
          <div
            key={i}
            className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-4 border p-3 rounded"
          >
            <input
              type="number"
              placeholder="Quantity"
              value={v.quantity}
              onChange={(e) => updateVariant(i, "quantity", e.target.value)}
              className="border p-2 rounded"
            />

            <select
              value={v.unit}
              onChange={(e) => updateVariant(i, "unit", e.target.value)}
              className="border p-2 rounded"
            >
              {unitOptions.map((u) => (
                <option key={u}>{u}</option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Price"
              value={v.price}
              onChange={(e) => updateVariant(i, "price", e.target.value)}
              className="border p-2 rounded"
            />

            <input
              type="number"
              placeholder="MRP"
              value={v.mrp}
              onChange={(e) => updateVariant(i, "mrp", e.target.value)}
              className="border p-2 rounded"
            />

            <input
              type="number"
              placeholder="Stock"
              value={v.stock}
              onChange={(e) => updateVariant(i, "stock", e.target.value)}
              className="border p-2 rounded"
            />

            <button onClick={() => removeVariant(i)} className="text-red-500">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* IMAGES */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <label className="border-2 border-dashed p-6 flex flex-col items-center cursor-pointer text-gray-500">
          <Upload />
          <span>Upload Images</span>
          <input type="file" multiple hidden onChange={handleImage} />
        </label>

        <div className="flex gap-2 mt-4">
          {preview.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              className="h-20 w-20 object-cover rounded"
            />
          ))}
        </div>
      </div>

      <button
        onClick={saveProduct}
        className="bg-green-600 text-white px-6 py-2 rounded"
      >
        {editingId ? "Update Product" : "Save Product"}
      </button>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search product..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        className="border px-4 py-2 mt-4 w-full rounded"
      />

      {/* LIST */}
      <h2 className="text-xl font-bold mt-10 mb-4">Products</h2>
      <div className="grid grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p._id} className="bg-white p-4 rounded shadow">
            <img
              src={`http://localhost:5000${p.thumbnail}`}
              alt=""
              className="h-32 w-full object-cover rounded"
            />
            <p className="font-semibold mt-2">{p.name}</p>
            <p>From ₹{p.minPrice}</p>
            {!p.isAvailable && (
              <p className="text-red-500 text-sm">Out of Stock</p>
            )}
            <button
              onClick={() => editProduct(p)}
              className="text-green-600 mt-2"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(p._id)}
              className="text-red-600 mt-2 ml-4"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
