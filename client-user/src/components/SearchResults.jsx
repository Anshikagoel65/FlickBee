import { useEffect, useState } from "react";
import { useSearch } from "../context/SearchContext";
import { getProducts } from "../services/productApi";
import ProductCard from "./ProductCard";

const SearchResults = () => {
  const { searchQuery } = useSearch();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then((data) => {
      const normalized = data.map((p) => ({
        ...p,
        id: p._id,
      }));

      setProducts(normalized);
    });
  }, []);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!searchQuery) return null;

  return (
    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {filtered.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default SearchResults;
