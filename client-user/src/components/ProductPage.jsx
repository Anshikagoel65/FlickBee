import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductById } from "../services/productApi";
import { useCart } from "../context/CartContext";

const API_BASE = process.env.REACT_APP_API_BASE;

const ProductPage = () => {
  const { id } = useParams();
  const { cart, addToCart, removeFromCart } = useCart();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    getProductById(id).then((data) => {
      setProduct(data);
      setActiveImage(data.thumbnail);
    });
  }, [id]);

  if (!product) {
    return (
      <div className="pt-[80px] flex justify-center items-center text-gray-500">
        Loading product...
      </div>
    );
  }

  const quantity = cart[product._id]?.cartQty || 0;

  return (
    <div className="max-w-[1200px] mx-auto px-4 pt-[80px] pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="w-full h-[300px] sm:h-[420px] bg-white border rounded-xl flex items-center justify-center">
            <img
              src={`${API_BASE}${activeImage}`}
              alt={product.name}
              className="max-h-full object-contain"
            />
          </div>
          <div className="flex gap-3 mt-4 overflow-x-auto">
            {[product.thumbnail, ...(product.images || [])].map((img, i) => (
              <div
                key={i}
                onClick={() => setActiveImage(img)}
                className={`w-16 h-16 flex-shrink-0 border rounded-lg overflow-hidden cursor-pointer
                  ${activeImage === img ? "border-green-500" : ""}
                `}
              >
                <img
                  src={`${API_BASE}${img}`}
                  className="w-full h-full object-cover"
                  alt=""
                />
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-2">
            Home / {product.category?.name}
          </p>

          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            {product.name}
          </h1>

          <p className="text-gray-600 mb-4">
            {product.quantity?.[0]} {product.unit?.[0]}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold">₹{product.price}</span>
                {product.mrp > product.price && (
                  <span className="text-gray-400 line-through text-lg">
                    ₹{product.mrp}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                (Inclusive of all taxes)
              </p>
            </div>
            {quantity === 0 ? (
              <button
                onClick={() => addToCart(product)}
                className="
                  bg-green-600
                  hover:bg-green-700
                  text-white
                  px-6
                  py-3
                  rounded-lg
                  text-base
                  font-semibold
                  w-full
                  sm:w-auto
                  min-w-[160px]
                "
              >
                Add to cart
              </button>
            ) : (
              <div className="flex items-center gap-4 border border-green-600 rounded-lg bg-green-700 text-white">
                <button
                  onClick={() => removeFromCart(product)}
                  className="w-10 h-10 rounded-lg text-xl"
                >
                  −
                </button>
                <span className="text-lg font-semibold">{quantity}</span>
                <button
                  onClick={() => addToCart(product)}
                  className="w-10 h-10 rounded-lg text-xl"
                >
                  +
                </button>
              </div>
            )}
          </div>
          <div className="mt-8 space-y-5">
            <h3 className="text-lg font-semibold">Why shop from us?</h3>

            <div className="flex gap-4">
              <span>🚚</span>
              <p className="text-gray-600">
                Round the clock delivery from stores near you.
              </p>
            </div>

            <div className="flex gap-4">
              <span>💰</span>
              <p className="text-gray-600">
                Best prices and offers directly from manufacturers.
              </p>
            </div>

            <div className="flex gap-4">
              <span>🛒</span>
              <p className="text-gray-600">
                Choose from thousands of products across categories.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
