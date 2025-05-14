import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import '../../../app/src/styles.css';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div className="search-bar">
       <button onClick={handleSearch} className="icon-button">
        <Icon name="search" size={16} />
      </button>
      <input
        type="text"
        placeholder="Rechercher..."
        className="search-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
