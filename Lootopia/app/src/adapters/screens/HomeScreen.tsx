import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  Platform,
  Appearance,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Colors } from '@/constants/Colors';
import { BoutiqueSection, ButtonGrid, EvenementsSection, Header, Menu } from '@/components/ui/home/AndroidHomeComponents';
import { BottomBar } from '@/components/ui/home/BottomBar';
import { SideMenu } from '@/components/ui/home/SideMenu';
import SearchBar from '@/components/ui/home/SearchBar';
import HuntingCard from '@/components/ui/home/HuntingCard';
import EvenementCard from '@/components/ui/home/EvenementCard';

const screenWidth = Dimensions.get('window').width;

export const HomeScreen = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(Appearance.getColorScheme() || 'light'); 
  const [menuTranslateX] = useState(new Animated.Value(0));
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');


      useEffect(() => {
      if (Platform.OS === 'web') {
        document.documentElement.classList.add(theme);
    
        return () => {
          document.documentElement.classList.remove('light', 'dark');
        };
      }
    }, [theme]);
  
    const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
  
      if (Platform.OS === 'web') {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(newTheme);
      }
  
      return newTheme;
    });
  };

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

   if (Platform.OS === 'android') {
    return (
      <View style={{ flex: 1, backgroundColor: 'var(--background-color)' }}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
          <Menu toggleMenu={toggleMenu} />
          <Header />
          <ButtonGrid />
          <EvenementsSection />
          <BoutiqueSection />
        </ScrollView>
        <BottomBar />
        <TouchableOpacity
          onPress={toggleTheme}
          style={{ position: 'absolute', bottom: 20, right: 20 }}
        >
          <Icon name="moon-o" size={30} color="var(--icon-color)" />
        </TouchableOpacity>
      </View>
    );
  }
  
  if (Platform.OS === 'web') {
    return (
      <View style={{ flex: 1, backgroundColor: 'var(--background-color)' }}>
        {isMenuOpen && <SideMenu theme={theme === 'dark' ? Colors.dark : Colors.light}/>}
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
                  backgroundColor: 'var(--background-color)',
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <TouchableOpacity onPress={toggleMenu}>
                    <Icon name="bars" size={40} color="var(--icon-color)" />
                  </TouchableOpacity>
                    <SearchBar onSearch={(query) => setSearchQuery(query)} />
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={toggleTheme} style={{ marginRight: 10 }}>
                      <Icon name="moon-o" size={30} color="var(--icon-color)" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Icon name="user-circle" size={40} color="var(--icon-color)" />
                    </TouchableOpacity>
                  </View>
                </View>
  
                <HuntingCard />
                <EvenementCard />
              </ScrollView>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  return null;
};
