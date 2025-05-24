import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Dimensions,
  Platform,
  Appearance,
} from 'react-native';
import HuntingCard from '@/components/ui/home/HuntingCard';
import '../../../src/styles.css';
import { BoutiqueSection, ButtonGrid, EvenementsSection, Header, Menu } from '@/components/ui/home/AndroidHomeComponent';
import { BottomBar } from '@/components/ui/home/BottomBar';
import EvenementCard from '@/components/ui/home/EvenementCard';

const screenWidth = Dimensions.get('window').width;

export const HomeScreen = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(Appearance.getColorScheme() || 'light');
  const [menuTranslateX, setMenuTranslateX] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      <div className="web-container">
              <HuntingCard />
              <EvenementCard />
            </div>
    );
  }

  return null;
};

export default HomeScreen;