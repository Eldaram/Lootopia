import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, TouchableWithoutFeedback, Animated, Dimensions, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SideMenu } from './components/SideMenu';
import SearchBar from '@/app/src/adapters/screens/Home/components/SearchBar';
import HuntingCard from './components/HuntingCard';
import EvenementCard from './components/EvenementCard';
import { BoutiqueSection, ButtonGrid, EvenementsSection, Header, Menu } from './components/AndroidHomeComponents';
import { BottomBar } from './components/BottomBar';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const screenWidth = Dimensions.get('window').width;

export const HomeScreen = () => {
  const systemColorScheme = useColorScheme(); 
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark'); 
  const theme = Colors[isDarkMode ? 'dark' : 'light'];
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
        toValue: screenWidth * 0.2,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  if (Platform.OS === 'android') {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
          <Menu toggleMenu={toggleMenu} />
          <Header />
          <ButtonGrid />
          <EvenementsSection />
          <BoutiqueSection />
        </ScrollView>
        <BottomBar />
        <TouchableOpacity onPress={toggleDarkMode} style={{ position: 'absolute', bottom: 20, right: 20 }}>
          <Icon name={isDarkMode ? 'sun-o' : 'moon-o'} size={30} color={theme.icon} />
        </TouchableOpacity>
      </View>
    );
  }

  if (Platform.OS === 'web') {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        {isMenuOpen && <SideMenu theme={theme}/>}
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
                  backgroundColor: theme.background,
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <TouchableOpacity onPress={toggleMenu}>
                    <Icon name="bars" size={40} color={theme.icon} />
                  </TouchableOpacity>
                  <SearchBar onSearch={handleSearch} theme={theme} />
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={toggleDarkMode} style={{ marginRight: 10 }}>
                      <Icon name={isDarkMode ? 'sun-o' : 'moon-o'} size={30} color={theme.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Icon name="user-circle" size={40} color={theme.icon} />
                    </TouchableOpacity>
                  </View>
                </View>

                <HuntingCard theme={theme}/>
                <EvenementCard theme={theme} />
              </ScrollView>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  return null;
};
