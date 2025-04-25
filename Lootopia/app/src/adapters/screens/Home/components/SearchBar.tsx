import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [inputWidth, setInputWidth] = useState(Dimensions.get('window').width * 0.5); 

 
  useEffect(() => {
    const updateInputWidth = () => {
      const screenWidth = Dimensions.get('window').width;
      setInputWidth(screenWidth * 0.5); 
    };

    updateInputWidth();

    const subscription = Dimensions.addEventListener('change', updateInputWidth);

    return () => {
      subscription.remove();
    };
  }, []);

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        marginBottom: 20,
        marginHorizontal: 20,
      }}
    >
      <TextInput
        style={{
          flex: 1,
          width: inputWidth,
          height: 40,
          paddingLeft: 10,
          fontSize: 16,
          borderRadius: 12,
        }}
        value={query}
        onChangeText={setQuery}
        placeholder="Rechercher..."
        placeholderTextColor="#888"
      />
      <TouchableOpacity onPress={handleSearch} style={{ padding: 10 }}>
        <Icon name="search" size={20} color="#555" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;
