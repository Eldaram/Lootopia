import { BoutiqueSection, ButtonGrid, EvenementsSection, Header } from '@/components/ui/home/AndroidHomeComponent';
import { BottomBar } from '@/components/ui/home/BottomBar';
import EvenementCard from '@/components/ui/home/EvenementCard';
import HuntingCard from '@/components/ui/home/HuntingCard';
import { Colors } from '@/constants/Colors';
import { useState } from 'react';
import { Animated, Dimensions, Platform, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { View } from 'react-native';
import { useTheme } from '@/constants/ThemeProvider';

export default function Home() {
  const screenWidth = Dimensions.get('window').width;
  const { theme } = useTheme();
  const themeColors = Colors[theme]; 
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
    const toValue = isMenuOpen ? 0 : screenWidth * 0.2;
    Animated.timing(menuTranslateX, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsMenuOpen(!isMenuOpen);
  };

  if (Platform.OS === 'android') {
    return (
      <View style={{ flex: 1, backgroundColor: themeColors.background }}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
          <Header />
          <ButtonGrid />
          <EvenementsSection />
          <BoutiqueSection />
        </ScrollView>
      </View>
    );
  }

  if (Platform.OS === 'web') {
    return (
      <View style={{ flex: 1, backgroundColor: themeColors.background }}>
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
                  backgroundColor: themeColors.background,
                }}
              >
                <HuntingCard theme={themeColors} />
                <EvenementCard theme={themeColors} />
              </ScrollView>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}
