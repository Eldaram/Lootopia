import React, { useState, useEffect } from 'react';
import { 
  View, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Dimensions,  
  Platform,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import SearchBar from '@/components/ui/home/SearchBar';
import { SideMenu } from '@/components/ui/home/SideMenu';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/constants/ThemeProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSession } from '@/app/src/services/authService';

const screenWidth = Dimensions.get('window').width;

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuTranslateX, setMenuTranslateX] = useState(new Animated.Value(0));
  const [searchQuery, setSearchQuery] = useState('');
  const [userRole, setUserRole] = useState<string | null>(null); 
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const themeName = theme;
  const themeColors = Colors[themeName];
  const menuWidth = Platform.OS === 'web' ? screenWidth * 0.2 : screenWidth * 0.8;
  const isSmallScreen = screenWidth < 768;

  useEffect(() => {
    const fetchUserSession = async () => {
        const session = await getSession();
        if (session) {
          setUserRole(session.role); 
          setIsLoggedIn(true);
  
          const userAppearanceId = session.appearance_id; 
          if (userAppearanceId === 1 && theme !== 'dark') {
            toggleTheme(); 
          } else if (userAppearanceId === 2 && theme !== 'light') {
            toggleTheme(); 
          }
        } else {
          setUserRole(null);
          setIsLoggedIn(false);
        }
    };
  
    fetchUserSession();
  }, []);

  const handleToggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
  
        user.appearance_id = newTheme === 'dark' ? 1 : 2;
        await AsyncStorage.setItem('user', JSON.stringify(user));
  
        const res = await fetch(`http://localhost:3000/api/users/${user.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            appearance_id: user.appearance_id,
          }),
        });
      }
    toggleTheme();
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
        useNativeDriver: true,
      }).start();      
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
      {isMenuOpen && (
        <>
          <TouchableOpacity
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 15 }}
            activeOpacity={1}
            onPress={handleOutsidePress}
          />
          <ScrollView style={{ position: 'absolute', top: 0, left: 0, width: menuWidth, height: '100%', zIndex: 20 }}>
            <SideMenu themeColors={themeColors} />
          </ScrollView>
        </>
      )}
  
      <Animated.View
        style={{
          flex: 1,
          width: '100%',
          transform: [{ translateX: menuTranslateX }],
        }}
      >
        <View style={{ 
          flexDirection: Platform.OS === 'android' ? 'row' : (isSmallScreen ? 'column' : 'row'),
          alignItems: 'center',
          justifyContent: Platform.OS === 'android' ? 'flex-end' : 'space-between',
          padding: 10 
        }}>
          {Platform.OS === 'web' && (
              <TouchableOpacity style={{ margin: 10, padding: 8, alignItems: 'center', justifyContent: 'center' }} onPress={toggleMenu}>
                <Icon name="bars" size={40} color={themeColors.icon} />
                </TouchableOpacity>
            )}
  
          {Platform.OS !== 'android' && (
            <>
              <TouchableOpacity style={{ margin: 10, padding: 8, alignItems: 'center', justifyContent: 'center' }} onPress={() => {
                setIsMenuOpen(false); 
                router.push('/');
              }}>
                <Image source={require('@/assets/images/logo.png')} style={{ width: 120, height: 120, resizeMode: 'contain' }} />
              </TouchableOpacity>
  
              <SearchBar onSearch={setSearchQuery} themeColors={themeColors} />
            </>
          )}
  
          <View style={{ flexDirection: Platform.OS === 'web' && screenWidth < 768 ? 'column' : 'row', alignItems: 'center' }}>
            <TouchableOpacity style={{ margin: 10, padding: 8, alignItems: 'center', justifyContent: 'center' }} onPress={handleToggleTheme}>
              <Icon name={themeName === 'light' ? 'moon-o' : 'sun-o'} size={30} color={themeColors.icon} />
            </TouchableOpacity>
            <TouchableOpacity style={{ margin: 10, padding: 8, alignItems: 'center', justifyContent: 'center' }} onPress={() => {
              setIsMenuOpen(false);
              router.push('/profile');
            }}>
              <Icon name="user-circle" size={40} color={themeColors.icon} />
            </TouchableOpacity>
          </View>
        </View>
  
        <ScrollView contentContainerStyle={{ padding: 16, flexGrow: 1, backgroundColor: themeColors.background }}>
          {children}
        </ScrollView>
      </Animated.View>
    </View>
  );  
};
