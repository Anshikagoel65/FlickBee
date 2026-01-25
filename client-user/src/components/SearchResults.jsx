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
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (!searchQuery) return null;

  return (
    <div
      className="
    mt-6
    grid
    gap-x-3
    gap-y-4
    justify-start
    [grid-template-columns:repeat(auto-fill,250px)]
  "
    >
      {filtered.map((product) => (
        <ProductCard key={product.id} product={product} variant="grid" />
      ))}
    </div>
  );
};

export default SearchResults;
