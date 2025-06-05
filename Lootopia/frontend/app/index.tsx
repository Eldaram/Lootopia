import { BoutiqueSection, ButtonGrid, EvenementsSection, Header } from '@/components/ui/home/AndroidHomeComponent';
import { BottomBar } from '@/components/ui/home/BottomBar';
import EvenementCard from '@/components/ui/home/EvenementCard';
import HuntingCard from '@/components/ui/home/HuntingCard';
import { Colors } from '@/constants/Colors';
import { useState } from 'react';
import { Animated, Dimensions, Platform, ScrollView, TouchableOpacity, TouchableWithoutFeedback, useColorScheme } from 'react-native';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Home() {
  const screenWidth = Dimensions.get('window').width;
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
      <View style={{ flex: 1, backgroundColor: theme.background }}>
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
                <HuntingCard theme={theme} />
                <EvenementCard theme={theme} />
              </ScrollView>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}
