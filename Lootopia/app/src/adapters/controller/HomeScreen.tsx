import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TouchableWithoutFeedback, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SideMenu } from './SideMenu';
import SearchBar from '@/app/src/adapters/controller/SearchBar';

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

  const handleMenuOpen = () => {
    setIsMenuOpen(true);
    Animated.timing(menuTranslateX, {
      toValue: 420,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log('Search Query:', query);
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
                <TouchableOpacity onPress={handleMenuOpen}>
                  <Icon name="bars" size={30} color="#555" />
                </TouchableOpacity>
                 <SearchBar onSearch={handleSearch}  />
                <TouchableOpacity>
                  <Icon name="user-circle" size={40} color="#555" />
                </TouchableOpacity>
              </View>

              <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 24, marginBottom: 12 }}>
                Chasses disponibles 🟢
              </Text>
              <View
                style={{
                  backgroundColor: '#ffff',
                  borderRadius: 12,
                  marginBottom: 400,
                }}
              ></View>

              <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 24, marginBottom: 12 }}>
                Évènements
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12, backgroundColor: '#ffff',}}></ScrollView>
            </ScrollView>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};
