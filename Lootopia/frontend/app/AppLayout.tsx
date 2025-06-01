import React, { useState } from 'react';
import { 
  View, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Dimensions,  
  useColorScheme, 
  Platform,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import SearchBar from '@/components/ui/home/SearchBar';
import { SideMenu } from '@/components/ui/home/SideMenu';
import { Colors } from '@/constants/Colors';

const screenWidth = Dimensions.get('window').width;

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuTranslateX, setMenuTranslateX] = useState(new Animated.Value(0));
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
   const systemColorScheme = useColorScheme(); 
   const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
const themeName = isDarkMode ? 'dark' : 'light'; 
  const theme = Colors[themeName];  
  
  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
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

  const handleOutsidePress = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
      Animated.timing(menuTranslateX, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();      
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {isMenuOpen && (
        <>
          <TouchableOpacity
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 15 }}
            activeOpacity={1}
            onPress={handleOutsidePress}
          />
          <ScrollView style={{ position: 'absolute', top: 0, left: 0, width: '20%', height: '100%', zIndex: 20 }}>
            <SideMenu theme={theme}/>
          </ScrollView>
        </>
      )}
  
      <Animated.View style={{ flex: 1, width: '100%', marginLeft: menuTranslateX }}>
        <View style={{ flexDirection: Platform.OS === 'web' && screenWidth < 768 ? 'column' : 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10 }}>
          <TouchableOpacity style={{ margin: 10, padding: 8, alignItems: 'center', justifyContent: 'center' }} onPress={toggleMenu}>
            <Icon name="bars" size={40} color={theme.icon} />
          </TouchableOpacity>
  
          <TouchableOpacity style={{ margin: 10, padding: 8, alignItems: 'center', justifyContent: 'center' }} onPress={() => {
            setIsMenuOpen(false); 
            router.push('/');
          }}>
            <Image source={require('@/assets/images/logo.png')} style={{ width: 120, height: 120, resizeMode: 'contain' }} />
          </TouchableOpacity>
  
          <SearchBar onSearch={setSearchQuery} theme={theme}/>
  
          <View style={{ flexDirection: Platform.OS === 'web' && screenWidth < 768 ? 'column' : 'row', alignItems: 'center' }}>
            <TouchableOpacity style={{ margin: 10, padding: 8, alignItems: 'center', justifyContent: 'center' }} onPress={toggleTheme}>
            <Icon name={themeName === 'light' ? 'moon-o' : 'sun-o'} size={30} color={theme.icon} />
            </TouchableOpacity>
            <TouchableOpacity style={{ margin: 10, padding: 8, alignItems: 'center', justifyContent: 'center' }} onPress={() => {
              setIsMenuOpen(false);
              router.push('/profile');
            }}>
              <Icon name="user-circle" size={40} color={theme.icon} />
            </TouchableOpacity>
          </View>
        </View>
  
        <ScrollView contentContainerStyle={{ padding: 16, flexGrow: 1, backgroundColor: theme.background }}>
          {children}
        </ScrollView>
      </Animated.View>
    </View>
  );  
};
