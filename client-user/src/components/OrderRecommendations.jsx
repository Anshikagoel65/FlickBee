import { useEffect, useState } from "react";
import { getOrderRecommendations } from "../services/orderApi";
import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";

const OrderRecommendations = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getOrderRecommendations()
      .then((res) => setProducts(res.data))
      .catch(console.error);
  }, []);

  if (!products.length) return null;

  return (
    <div className="pt-20 pb-20">
      <div className="flex justify-between items-center mb-4 px-1">
        <h2 className="text-2xl font-bold">Recommended for you</h2>
        <button
          onClick={() => navigate("/")}
          className="text-green-600 font-medium text-base"
        >
          See all
        </button>
      </div>
      <div className="overflow-x-auto scrollbar-hide snap-x snap-mandatory">
        <div className="flex gap-1 min-w-max px-1">
          {products.map((product) => (
            <div key={product._id} className="flex-shrink-0 w-[280px]">
              <div className="w-[1200px]">
                <div className="w-[280px]">
                  <ProductCard product={product} variant="carousel" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderRecommendations;
