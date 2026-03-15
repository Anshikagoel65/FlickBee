import { useEffect, useState } from "react";
import { getSimilarProducts } from "../services/productApi";
import ProductCard from "./ProductCard";

const SimilarProducts = ({ productId }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getSimilarProducts(productId).then(setProducts);
  }, [productId]);

  if (!products.length) return null;

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4">You may also like</h2>

      <div className="flex gap-4 overflow-x-auto pb-3">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default SimilarProducts;
