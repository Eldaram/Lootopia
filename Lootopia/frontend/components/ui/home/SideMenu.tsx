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
import { useRouter } from 'expo-router';
import '../../../app/src/styles.css'; 

export const SideMenu: React.FC = () => {
  const { width, height } = useWindowDimensions();
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
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
    { label: 'Accueil', icon: 'home', to: '/' as const },
    { label: 'Espace organisateur', icon: 'cogs', to: '/organiser' as const },
    { label: 'Mes Chasses', icon: 'bullseye', to: '/mes-chasses' as const },
    { label: 'Chasses disponibles', icon: 'gamepad', to: '/chasses-disponibles' as const },
    { label: 'Artefacts', icon: 'gem', to: '/artefacts' as const },
    { label: 'Classement', icon: 'list', to: '/classement' as const },
    { label: 'Tableau de bord(Admin)', icon: 'tachometer', to: '/tableau-de-bord' as const },
    { label: 'Boutique', icon: 'shopping-cart', to: '/boutique' as const },
    { label: 'Aide', icon: 'question-circle', to: '/aide' as const },
    { label: 'Déconnexion', icon: 'sign-out', to: '/deconnexion'as const  },
  ];

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
          onPress={() => router.push('/')}
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
          {menuItems.map((item, index) => (
            <TouchableOpacity
            key={index}
            onPress={() => router.push(item.to)}
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