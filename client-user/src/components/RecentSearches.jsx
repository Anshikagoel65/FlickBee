import { useSearch } from "../context/SearchContext";

const RecentSearches = () => {
  const { recentSearches, setSearchQuery, clearRecentSearches } = useSearch();

  if (recentSearches.length === 0) return null;

  return (
    <div className="bg-white rounded-xl p-4 mt-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold text-gray-700">Recent searches</h3>
        <button
          onClick={clearRecentSearches}
          className="text-base text-green-600 font-medium"
        >
          Clear
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {recentSearches.map((query) => (
          <button
            key={query}
            onClick={() => setSearchQuery(query)}
            className="
              px-3 py-1 text-sm
              bg-gray-100 rounded-full
              hover:bg-gray-200
            "
          >
            {query}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecentSearches;
