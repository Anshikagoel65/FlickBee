import { useSearch } from "../context/SearchContext";
import { useEffect, useState } from "react";
import { getProducts } from "../services/productApi";

const SearchSuggestions = () => {
  const { searchQuery } = useSearch();
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (!searchQuery) {
      setSuggestions([]);
      return;
    }

    getProducts().then((data) => {
      const filtered = data
        .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 5);

      setSuggestions(filtered);
    });
  }, [searchQuery]);

  if (!searchQuery || suggestions.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      {suggestions.map((item) => (
        <div
          key={item._id}
          className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-50 rounded-lg"
        >
          <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs">
            <img
              src={`http://localhost:5000${item.image}`}
              alt={item.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "/placeholder.png"; // optional fallback
              }}
            />
          </div>
          <span className="text-sm">{item.name}</span>
        </div>
      ))}
    </div>
  );
};

export default SearchSuggestions;
