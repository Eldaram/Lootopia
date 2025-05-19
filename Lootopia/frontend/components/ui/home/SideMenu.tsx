import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useLocation } from 'wouter';
import { getSession, clearSession } from '@/app/src/services/authService'; 
import '../../../app/src/styles.css'; 

export const SideMenu: React.FC = () => {
  const { width, height } = useWindowDimensions();
  const [, setLocation] = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null); 
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); 

  useEffect(() => {
    const fetchUserRole = async () => {
      const session = await getSession();
      if (session) {
        setUserRole(session.role); 
        setIsLoggedIn(true); 
      } else {
        setUserRole(null); 
        setIsLoggedIn(false); 
      }
    };

    fetchUserRole();
    const checkDarkMode = () => {
      const darkModeEnabled = document.documentElement.classList.contains('dark');
      setIsDarkMode(darkModeEnabled);
    };

    checkDarkMode();
    window.addEventListener('darkmodechange', checkDarkMode);

    return () => {
      window.removeEventListener('darkmodechange', checkDarkMode);
    };
  }, []); 

  const menuItems = [
    { label: 'Accueil', icon: 'home', to: '/' },
    { label: 'Organiser', icon: 'cogs', to: '/organiser', role: 'admin' }, 
    { label: 'Mes Chasses', icon: 'bullseye', to: '/mes-chasses' },
    { label: 'Chasses disponibles', icon: 'gamepad', to: '/chasses-disponibles' },
    { label: 'Artefacts', icon: 'gem', to: '/artefacts' },
    { label: 'Classement', icon: 'list', to: '/classement' },
    { label: 'Tableau de bord', icon: 'tachometer', to: '/dashboard', role: 'admin' },
    { label: 'Boutique', icon: 'shopping-cart', to: '/boutique' },
    { label: 'Aide', icon: 'question-circle', to: '/aide' },
    { label: 'Connexion', icon: 'sign-in', to: '/login' }, 
    { label: 'Déconnexion', icon: 'sign-out', to: '/deconnexion' },
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (isLoggedIn === false) {
      return ['/', '/chasses-disponibles', '/classement', '/boutique', '/aide', '/login'].includes(item.to);
    }
    if (isLoggedIn === true) {
      return item.label !== 'Connexion' && (!item.role || item.role === userRole);
    }
    return true;
  });

  const handleLogout = async () => {
    await clearSession(); 
    setIsLoggedIn(false);
    setLocation('/login');
  };

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: width * 0.19,
        height: height,
        zIndex: 1000,
      }}
    >
      <ImageBackground
        source={
          isDarkMode
            ? require('@/assets/images/menu-background-dark.png')
            : require('@/assets/images/menu-background.png')
        }
        resizeMode="cover"
        style={{
          flex: 1,
          paddingTop: 40,
          paddingHorizontal: 20,
          width: '100%',
          height: '100%',
        }}
      >
        <TouchableOpacity
          onPress={() => setLocation('/')}
          style={{
            alignSelf: 'center',
            padding: 10,
          }}
        >
          <Image
            source={require('@/assets/images/logo.png')}
            style={{
              width: 200,
              height: 250,
              resizeMode: 'contain',
              alignSelf: 'center',
            }}
          />
        </TouchableOpacity>

        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'flex-start',
          }}
          showsVerticalScrollIndicator={false}
        >
          {filteredMenuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                if (item.label === 'Déconnexion') {
                  handleLogout();
                } else {
                  setLocation(item.to);
                }
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 12,
                marginBottom: 8,
                backgroundColor: isDarkMode ? '#444' : '#f4f4f4',
                borderRadius: 10,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <View style={{ width: 30, alignItems: 'center' }}>
                <Icon
                  name={item.icon}
                  size={20}
                  color={isDarkMode ? '#fff' : '#333'}
                />
              </View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: isDarkMode ? '#fff' : '#333',
                  marginLeft: 8,
                }}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ImageBackground>
    </View>
  );
};
