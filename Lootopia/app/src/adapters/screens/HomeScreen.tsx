import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
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
import '../../../src/styles.css';

const screenWidth = Dimensions.get('window').width;

export const HomeScreen = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(Appearance.getColorScheme() || 'light');
  const [menuTranslateX, setMenuTranslateX] = useState(0);
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
      setMenuTranslateX(0);
    }
  };

  const toggleMenu = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
      setMenuTranslateX(0);
    } else {
      setIsMenuOpen(true);
      setMenuTranslateX(screenWidth * 0.2);
    }
  };

  if (Platform.OS === 'android') {
    return (
      <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        <Menu toggleMenu={toggleMenu} />
        <Header />
        <ButtonGrid />
        <EvenementsSection />
        <BoutiqueSection />
      </ScrollView>
    
      <BottomBar />
    </View>
    );
  }
  
  if (Platform.OS === 'web') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'var(--background-color)' }}>
        {isMenuOpen && <SideMenu theme={theme === 'dark' ? Colors.dark : Colors.light} />}
        
        <div onClick={handleOutsidePress} style={{ flex: 1 }}>
          <div style={{
            marginLeft: `${menuTranslateX}px`,
            transition: 'margin-left 300ms ease-in-out',
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              padding: 16,
              backgroundColor: 'var(--background-color)',
            }}>
              <div className="menu">
                <button className="icon-button" onClick={toggleMenu}>
                  <Icon name="bars" size={40} color="var(--icon-color)" />
                </button>

                <SearchBar onSearch={(query) => setSearchQuery(query)} />

                <div className="style-menu">
                  <button className="icon-button" onClick={toggleTheme}>
                    <Icon name="moon-o" size={30} color="var(--icon-color)" />
                  </button>
                  <button className="icon-button">
                    <Icon name="user-circle" size={40} color="var(--icon-color)" />
                  </button>
                </div>
              </div>

              <HuntingCard />
              <EvenementCard />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
