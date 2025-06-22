import { Slot, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Platform, Dimensions, Appearance, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SideMenu } from '@/components/ui/home/SideMenu';
import SearchBar from '@/components/ui/home/SearchBar';
import { Colors } from '@/constants/Colors';
import './src/styles.css'; // important : chemin relatif depuis _layout

const screenWidth = Dimensions.get('window').width;

export default function AppLayoutWrapper() {
  const [theme, setTheme] = useState<'light' | 'dark'>(Appearance.getColorScheme() || 'light');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuTranslateX, setMenuTranslateX] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (Platform.OS === 'web') {
      document.documentElement.classList.add(theme);
      return () => {
        document.documentElement.classList.remove('light', 'dark');
      };
    }
  }, [theme]);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
    setMenuTranslateX(prev => (prev === 0 ? screenWidth * 0.2 : 0)); 
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
  };

  const handleOutsidePress = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
      setMenuTranslateX(0);
    }
  };

  return (
    <div className="web-container">
      {isMenuOpen && (
        <div className="side-menu-visible">
          <SideMenu />
        </div>
      )}
      <div onClick={handleOutsidePress} className="flex-container">
        <div className="menu-container" style={{ marginLeft: `${menuTranslateX}px` }}>
          <div className="menu">
            <button className="icon-button" onClick={toggleMenu}>
              <Icon name="bars" size={40} color="var(--icon-color)" />
            </button>
            <button className="icon-button" onClick={() => router.push('/')}>
              <Image
                source={require('@/assets/images/logo.png')}
                style={{
                  width: 120,
                  height: 120,
                  resizeMode: 'contain',
                }}
              />
            </button>
            <SearchBar onSearch={setSearchQuery} />
            <div className="style-menu">
              <button className="icon-button" onClick={toggleTheme}>
                <Icon name={theme === 'light' ? 'moon-o' : 'sun-o'} size={30} color="var(--icon-color)" />
              </button>
              <button className="icon-button" onClick={() => router.push('/profile')}>
                <Icon name="user-circle" size={40} color="var(--icon-color)" />
              </button>
            </div>
          </div>
          <div className="content-container">
            <Slot />
          </div>
        </div>
      </div>
    </div>
  );
}
