import React from 'react';
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
import { Colors } from '@/constants/Colors';
import { useLocation } from 'wouter';
import '../../../app/src/styles.css';

interface SideMenuProps {
  theme: typeof Colors.light;
}

export const SideMenu: React.FC<SideMenuProps> = ({ theme }) => {
  const { width, height } = useWindowDimensions();
  const [, setLocation] = useLocation(); 

  const menuItems = [
    { label: 'Accueil', icon: 'home', to: '/' },
    { label: 'Organiser(Organisateur)', icon: 'cogs', to: '/organiser' },
    { label: 'Mes Chasses', icon: 'bullseye', to: '/mes-chasses' },
    { label: 'Chasses disponibles', icon: 'gamepad', to: '/chasses-disponibles' },
    { label: 'Artefacts', icon: 'gem', to: '/artefacts' },
    { label: 'Classement', icon: 'list', to: '/classement' },
    { label: 'Tableau de bord(Admin)', icon: 'tachometer', to: '/tableau-de-bord' },
    { label: 'Boutique', icon: 'shopping-cart', to: '/boutique' },
    { label: 'Aide', icon: 'question-circle', to: '/aide' },
    { label: 'Déconnexion', icon: 'sign-out', to: '/deconnexion' },
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
          theme === Colors.dark
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
        <button className="icon-button" onClick={() => setLocation('/')}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={{
            width: '100%',
            height: 250,
            resizeMode: 'contain',
            alignSelf: 'center',
            marginBottom: 20,
          }}
        />
        </button>
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
              onPress={() => setLocation(item.to)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 12,
                marginBottom: 8,
                backgroundColor: theme.cardBackground,
                borderRadius: 10,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Icon
                name={item.icon}
                size={20}
                color={theme.icon}
                style={{ marginRight: 10 }}
              />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: theme.text,
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
