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

interface SideMenuProps {
  theme: typeof Colors.light;
}

export const SideMenu: React.FC<SideMenuProps> = ({ theme }) => {
  const { width, height } = useWindowDimensions();
  
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: width * 0.19,
        height: height,
        zIndex: 10,
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

        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'flex-start',
          }}
        >
          {[
            { label: 'Accueil', icon: 'home' },
            { label: 'Organiser(Organisateur)', icon: 'cogs' },
            { label: 'Mes Chasses', icon: 'bullseye' },
            { label: 'Chasses disponibles', icon: 'gamepad' },
            { label: 'Artefacts', icon: 'gem' },
            { label: 'Classement', icon: 'list' },
            { label: 'Tableau de bord(Admin)', icon: 'tachometer' },
            { label: 'Boutique', icon: 'shopping-cart' },
            { label: 'Aide', icon: 'question-circle' },
            { label: 'Déconnexion', icon: 'sign-out' },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
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
