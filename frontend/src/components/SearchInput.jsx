import { Search, X } from "lucide-react";

export const SearchInput = ({searchQuery, setSearchQuery, placeholder = "Search..." }) => {

  const handleSearch = (e) => {
    const value = e.target.value; 
    setSearchQuery(value);
  }

  const clearSearch = (e) => {
    setSearchQuery("");
  }

  return (
    <div className="relative w-full"> 
      <label
        className="flex items-center w-full border border-gray-300 rounded-lg px-3 py-2
                   focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent
                   bg-base-100 transition-all cursor-text"
      >
        <Search className="size-5 text-base-content/40 mr-2 shrink-0" />
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleSearch}
          className="w-full bg-transparent border-none focus:outline-none text-sm pr-6"
        />

        {searchQuery && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
            title="Clear search"
          >
            <X className="size-4" />
          </button>
        )}
      </label>
    </div>
  );
}