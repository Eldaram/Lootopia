import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, FlatList, Dimensions, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { getSession } from '@/app/src/services/authService';
import { useTheme } from '@/constants/ThemeProvider';
import { useRouter } from 'expo-router';

const screenWidth = Dimensions.get('window').width;
const router = useRouter();

interface Event {
  id: string;
  title: string;
  description: string;
}

interface ShopOffer {
  id: string;
  title: string;
  description: string;
}

export const Header = () => {
 const { theme, toggleTheme } = useTheme();
   const themeName = theme;
   const themeColors = Colors[themeName];
   const [userName, setUserName] = useState<string | null>(null); 
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

    useEffect(() => {
      const fetchUserSession = async () => {
        const session = await getSession();
        if (session) {
          setUserName(session.username);
          setIsLoggedIn(true);
        }
      };
    
      fetchUserSession();
    }, []);    

  return (
    <View style={{ marginVertical: 20 }}>
      <Text style={{ fontSize: 36, fontWeight: 'bold', color: themeColors.text }}>
        Hi! {userName ?? 'Invité'} <Text style={{ fontSize: 30, marginLeft: 10 }}>🖐️</Text>
      </Text>
      <Text style={{ fontSize: 12, color: themeColors.icon }}>Welcome Back</Text>
    </View>
  );
};

export const ButtonGrid = () => {
  const { theme, toggleTheme } = useTheme();
   const themeName = theme;
   const themeColors = Colors[themeName];

  const buttons = ['Organiser', 'Chasses disponibles', 'Mes chasses', 'Mes artéfacts'];
  const handlePress = (text: string) => {
    if (text === 'Chasses disponibles') {
      router.push('/hunts'); 
    }
    if (text === 'Mes chasses') {
      router.push('/myHunts'); 
    }
  };

  return (
    <View style={{ marginTop: 40, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
      {buttons.map((text, index) => (
        <TouchableOpacity key={index} style={{ width: '48%', height: 120, marginBottom: 16 }}
        onPress={() => handlePress(text)}>
          <LinearGradient
            colors={index % 3 === 0 ? ['#F9968B', '#FF6347'] : ['#176A6C', '#2CCED2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.8,
              shadowRadius: 2,
              borderTopRightRadius: index === 3 ? 100 : 100,
              borderTopLeftRadius: 20,
              borderBottomRightRadius: index === 3 ? 20 : 20, 
              borderBottomLeftRadius: 20,
            }}
          >
            <Icon name={index % 2 === 0 ? 'map' : 'search'} size={30} color="white" />
            <Text style={{ color: 'white', marginTop: 10, fontWeight: 'bold' }}>{text}</Text>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export const EvenementsSection = () => {
  const { theme, toggleTheme } = useTheme();
   const themeName = theme;
   const themeColors = Colors[themeName];

  const eventsData: Event[] = [
    { id: '1', title: 'Chasse 1', description: 'Chasse à la créature mystérieuse.' },
    { id: '2', title: 'Chasse 2', description: 'Participe à une chasse épique dans la forêt.' },
    { id: '3', title: 'Chasse 3', description: 'Le grand défi de la ville.' },
  ];

  const renderEventItem = ({ item }: { item: Event }) => (
    <View
      style={{
        marginRight: 16,
        width: screenWidth * 0.6,
        backgroundColor: themeColors.cardBackground,
        borderRadius: 10,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        position: 'relative',
        height: 150,
      }}
    >
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50%',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
          zIndex: 1,
        }}
      />
      <View
        style={{
          zIndex: 2,
          position: 'relative',
          top: 75,
        }}
      >
        <Text style={{ fontWeight: 'bold', fontSize: 18, color: 'white' }}>{item.title}</Text>
        <Text style={{ color: 'white' }}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <View>
      <Text style={{ fontWeight: 'bold', fontSize: 20, marginVertical: 20, color: themeColors.text }}>
        Événements
      </Text>
      <FlatList
        data={eventsData}
        horizontal
        renderItem={renderEventItem}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

//TODO : remplacer donnée par 2 offre boutique au hazard
export const BoutiqueSection = () => {
  const { theme, toggleTheme } = useTheme();
   const themeName = theme;
   const themeColors = Colors[themeName];


  const shopOffers: ShopOffer[] = [
    { id: '1', title: 'Pack de Chasses', description: 'Augmente ton nombre de chasses disponibles.' },
    { id: '2', title: 'Potion Magique', description: 'Potion pour améliorer tes chances.' },
  ];

  const renderShopOffer = (item: ShopOffer) => (
    <View
      style={{
        flex: 1,
        marginRight: 8,
        backgroundColor: themeColors.cardBackground,
        padding: 12,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      }}
    >
      <Text style={{ fontWeight: 'bold', fontSize: 16, color: themeColors.text }}>{item.title}</Text>
      <Text style={{ fontSize: 12, color: themeColors.icon }}>{item.description}</Text>
    </View>
  );

  return (
    <View>
      <Text style={{ fontWeight: 'bold', fontSize: 20, marginVertical: 20, color: themeColors.text }}>
        Boutique
      </Text>

      <View
        style={{
          backgroundColor: themeColors.background,
          padding: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          borderRadius: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        {shopOffers.map((offer) => (
          <React.Fragment key={offer.id}>{renderShopOffer(offer)}</React.Fragment>
        ))}
      </View>
    </View>
  );
};
