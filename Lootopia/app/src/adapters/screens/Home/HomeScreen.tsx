import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, TouchableWithoutFeedback, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SideMenu } from './components/SideMenu';
import SearchBar from '@/app/src/adapters/screens/Home/components/SearchBar';
import HuntingCard from './components/HuntingCard';
import EvenementCard from './components/EvenementCard';

export const HomeScreen = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuTranslateX] = useState(new Animated.Value(0));
  const [searchQuery, setSearchQuery] = useState('');

  const handleOutsidePress = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
      Animated.timing(menuTranslateX, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log('Search Query:', query);
  };

  const toggleMenu = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
      Animated.timing(menuTranslateX, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      setIsMenuOpen(true);
      Animated.timing(menuTranslateX, {
        toValue: 420,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {isMenuOpen && <SideMenu />}
      <TouchableWithoutFeedback onPress={handleOutsidePress}>
        <View style={{ flex: 1 }}>
          <Animated.View
            style={{
              flex: 1,
              marginLeft: menuTranslateX,
            }}
          >
            <ScrollView
              style={{
                flex: 1,
                padding: 16,
                backgroundColor: '#f5f5f5',
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <TouchableOpacity onPress={toggleMenu}>
                  <Icon name="bars" size={30} color="#555" />
                </TouchableOpacity>
                <SearchBar onSearch={handleSearch} />
                <TouchableOpacity>
                  <Icon name="user-circle" size={40} color="#555" />
                </TouchableOpacity>
              </View>

              <HuntingCard />
              <EvenementCard />
            </ScrollView>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};
