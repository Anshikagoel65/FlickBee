import { useSearch } from "../context/SearchContext";
import { useEffect } from "react";
import SearchSuggestions from "../components/SearchSuggestions";
import SearchResults from "../components/SearchResults";
import RecentSearches from "../components/RecentSearches";

const Search = () => {
  const { searchQuery } = useSearch();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="max-w-[1400px] mx-auto px-6 py-6">
      <SearchSuggestions />
      {searchQuery && (
        <p className="mt-4 text-sm font-medium">
          Showing results for <span className="font-bold">"{searchQuery}"</span>
        </p>
      )}
      <RecentSearches />
      <SearchResults />
    </main>
  );
};

export default Search;
