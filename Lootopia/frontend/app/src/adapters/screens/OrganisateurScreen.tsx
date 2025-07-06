import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Dimensions,
  Platform,
  Appearance,
  Text,
} from 'react-native';
import '../../../src/styles.css';
import {
  BoutiqueSection,
  ButtonGrid,
  EvenementsSection,
  Header,
  Menu,
} from '@/components/ui/home/AndroidHomeComponent';
import { BottomBar } from '@/components/ui/home/BottomBar';
import HuntCard from '@/components/ui/organisateur/HuntCard';
import CartCard from '@/components/ui/organisateur/CartCard';
import CollectionsCard from '@/components/ui/organisateur/CollectionsCard';

const screenWidth = Dimensions.get('window').width;

export const OrganisateurScreen = () => {
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
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' }}>
            Espace Organisateur
          </Text>
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
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>
          Espace Organisateur
        </h1>
        <HuntCard />
        <CartCard />
        <CollectionsCard />
      </div>
    );
  }

  return null;
};
