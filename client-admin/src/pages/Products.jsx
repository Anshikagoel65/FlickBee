import { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import { fetchCategories } from "../api/categoryApi";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../api/productApi";

const Products = () => {
  /* ================= STATES ================= */
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);

  // product fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [mrp, setMrp] = useState("");
  const [productType, setProductType] = useState("");
  const [category, setCategory] = useState("");

  // arrays
  const [quantity, setQuantity] = useState([500]);
  const [unit, setUnit] = useState(["gram"]);

  // images
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);

  /* ================= LOAD DATA ================= */

  const loadProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data || []);
      setAllProducts(res.data || []);
    } catch (err) {
      console.error("Product load failed", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          fetchCategories(),
          getProducts(),
        ]);

        setCategories(catRes.data || []);
        setProducts(prodRes.data || []);
        setAllProducts(prodRes.data || []);
      } catch (err) {
        console.error("Initial load failed", err);
      }
    };

    init();
  }, []);

  /* ================= IMAGE HANDLER ================= */
  const handleImage = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreview(files.map((f) => URL.createObjectURL(f)));
  };

  /* ================= EDIT ================= */
  const editProduct = (p) => {
    console.log("EDIT PRODUCT:", p);

    setEditingId(p._id);
    setName(p.name || "");
    setDescription(p.description || "");
    setPrice(p.price || "");
    setMrp(p.mrp || "");
    setProductType(p.productType || "");

    // ✅ SAFE category handling
    if (p.category && typeof p.category === "object") {
      setCategory(p.category._id);
    } else {
      setCategory("");
    }

    setQuantity(Array.isArray(p.quantity) ? p.quantity : []);
    setUnit(Array.isArray(p.unit) ? p.unit : []);

    // ✅ SAFE image preview
    if (Array.isArray(p.images) && p.images.length > 0) {
      setPreview(p.images.map((img) => `http://localhost:5000${img}`));
    } else {
      setPreview([]);
    }

    setImages([]);
  };

  /* ================= SAVE ================= */
  const saveProduct = async () => {
    if (
      !name ||
      !description ||
      !price ||
      !mrp ||
      !productType ||
      !category ||
      (!editingId && images.length === 0)
    ) {
      alert("Fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("mrp", mrp);
    formData.append("productType", productType);
    formData.append("category", category);
    formData.append("quantity", JSON.stringify(quantity));
    formData.append("unit", JSON.stringify(unit));

    images.forEach((img) => formData.append("images", img));

    try {
      if (editingId) {
        await updateProduct(editingId, formData);
      } else {
        await createProduct(formData);
      }

      resetForm();
      loadProducts();
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  /* ================= RESET ================= */
  const resetForm = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setPrice("");
    setMrp("");
    setProductType("");
    setCategory("");
    setQuantity([500]);
    setUnit(["gram"]);
    setImages([]);
    setPreview([]);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await deleteProduct(id);
    loadProducts();
  };

  /* ================= SEARCH ================= */
  const handleSearch = (value) => {
    setSearch(value);
    if (!value.trim()) return setProducts(allProducts);

    setProducts(
      allProducts.filter((p) =>
        p.name.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  /* ================= UI ================= */
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      {/* FORM */}
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

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border w-full mb-3 px-3 py-2 rounded"
        />

        <input
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border w-full mb-3 px-3 py-2 rounded"
        />

        <input
          placeholder="MRP"
          value={mrp}
          onChange={(e) => setMrp(e.target.value)}
          className="border w-full mb-3 px-3 py-2 rounded"
        />

        <select
          value={productType}
          onChange={(e) => setProductType(e.target.value)}
          className="border px-3 py-2 w-full mb-3 rounded"
        >
          <option value="">Select Product Type</option>
          <option value="grocery">Grocery</option>
          <option value="snacks">Snacks</option>
          <option value="beverages">Beverages</option>
          <option value="dairy">Dairy</option>
          <option value="fruits">Fruits</option>
          <option value="vegetables">Vegetables</option>
        </select>

        <input
          placeholder="Quantities (e.g. 500,1000)"
          value={quantity.join(",")}
          onChange={(e) =>
            setQuantity(
              e.target.value
                .split(",")
                .map((q) => Number(q.trim()))
                .filter(Boolean)
            )
          }
          className="border w-full mb-3 px-3 py-2 rounded"
        />

        <input
          placeholder="Units (e.g. gram,kg)"
          value={unit.join(",")}
          onChange={(e) =>
            setUnit(e.target.value.split(",").map((u) => u.trim()))
          }
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
          <span className="text-sm mt-2">Upload images</span>
          <input type="file" multiple hidden onChange={handleImage} />
        </label>

        <div className="flex gap-2 flex-wrap mb-4">
          {preview.map((src, i) => (
            <img
              key={i}
              src={src}
              className="h-20 w-20 object-cover rounded"
              alt="preview"
            />
          ))}
        </div>

        <button
          onClick={saveProduct}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {editingId ? "Update Product" : "Save Product"}
        </button>
      </div>
      <input
        type="text"
        placeholder="Search product..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        className="border px-4 py-2 mb-6 w-full rounded"
      />

      {/* LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p._id} className="bg-white p-3 rounded-xl shadow">
            <img
              src={
                p.thumbnail
                  ? `http://localhost:5000${p.thumbnail}`
                  : p.images?.length
                  ? `http://localhost:5000${p.images[0]}`
                  : p.image
                  ? `http://localhost:5000${p.image}`
                  : "/placeholder.png"
              }
              alt={p.name}
              className="h-40 w-full object-cover rounded"
            />

            <div className="mt-2">
              <p className="font-semibold">{p.name}</p>
              <p className="text-sm text-gray-500">
                ₹{p.price} · {p.quantity?.join(", ")} {p.unit?.join(", ")}
              </p>
            </div>

            <div className="flex gap-3 mt-2">
              <button onClick={() => editProduct(p)} className="text-green-600">
                Edit
              </button>
              <button
                onClick={() => handleDelete(p._id)}
                className="text-red-600"
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
