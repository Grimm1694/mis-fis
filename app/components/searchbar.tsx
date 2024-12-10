import { useState } from 'react';

interface SearchBarProps {
  onSelect: (result: {
    id: number;
    s_name: string;
    usno: string;
    st_email: string;
    st_mobile: string;
    parent_mobile: string;
  }) => void; // Adjusted to accept the full object
  onClear: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSelect, onClear }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<{id: number; s_name: string; usno: string; st_email: string; st_mobile: string; parent_mobile: string }[]>([]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (query) {
      const res = await fetch(`/api/adm_searchEmail?query=${query}`);
      const data = await res.json();
      setResults(data.results);
    } else {
      setResults([]);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery(''); // Clear search query
    setResults([]); // Clear search results
    onClear(); // Call the onClear prop to clear data in the parent component
  };

  const handleSelect = (result: {
    id: number;
    s_name: string;
    usno: string;
    st_email: string;
    st_mobile: string;
    parent_mobile: string;
  }) => {
    onSelect(result); // Pass the selected result to the parent component
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search by name, usno, email..."
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        className="search-input w-full p-2 border border-gray-300 rounded mt-1"
      />
      <button onClick={handleClearSearch} className="text-blue-500 mt-2">
        Clear Search
      </button>
      {results.length > 0 && (
        <ul className="search-results cursor-pointer max-h-40 overflow-y-scroll border mt-2 hover:bg-gray-200">
          {results.map((result,index) => (
            <li
              key={index+1} // Ensure a unique key for each list item
              onClick={() => handleSelect(result)}
              //onClick={() => onSelect(result.st_mobile)}
              className="hover:bg-gray-100 px-2 py-1"
            >
              {index+1} - {result.s_name} - {result.usno} - {result.st_email} - {result.st_mobile} - {result.parent_mobile}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
  
};

export default SearchBar;
