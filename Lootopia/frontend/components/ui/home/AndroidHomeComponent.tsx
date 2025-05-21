import React from 'react';
import { View, TouchableOpacity, Text, FlatList, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';

const screenWidth = Dimensions.get('window').width;

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

interface MenuProps {
  toggleMenu: () => void;
}

export const Menu: React.FC<MenuProps> = ({ toggleMenu }) => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
    <TouchableOpacity onPress={toggleMenu}>
      <Icon name="bars" size={40} color="#555" />
    </TouchableOpacity>
    <TouchableOpacity>
      <Icon name="user-circle" size={40} color="#555" />
    </TouchableOpacity>
  </View>
);

//TODO : changer Stanly par le username
export const Header = () => (
  <View style={{ marginVertical: 20 }}>
    <Text style={{ fontSize: 36, fontWeight: 'bold' }}>Hi! Stanly  <Text style={{ fontSize: 30, marginLeft: 10 }}>🖐️</Text></Text>
    <Text style={{ fontSize: 12, color: '#555' }}>Welcome Back</Text>
  </View>
);

export const ButtonGrid = () => {
  const buttons = ['Organiser', 'Chasses disponibles', 'Mes chasses', 'Mes artéfacts'];

  return (
    <View style={{ marginTop: 40, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
      {buttons.map((text, index) => (
        <TouchableOpacity key={index} style={{ width: '48%', height: 120, marginBottom: 16 }}>
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

//TODO: a remplacer par 3 events au hazard
export const EvenementsSection = () => {
  const eventsData: Event[] = [
    { id: '1', title: 'Chasse 1', description: 'Chasse à la créature mystérieuse.' },
    { id: '2', title: 'Chasse 2', description: 'Participe à une chasse épique dans la forêt.' },
    { id: '3', title: 'Chasse 3', description: 'Le grand défi de la ville.' },
  ];

  const renderEventItem = ({ item }: { item: Event }) => (
    <View style={{ marginRight: 16, width: screenWidth * 0.6, backgroundColor: '#F27438', borderRadius: 10, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, position: 'relative',height: 150, }}>
      
      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%', 
        backgroundColor: 'rgba(0, 0, 0, 0.4)', 
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        zIndex: 1, 
        
      }} />

      <View style={{ zIndex: 2, position: 'relative',
        top: 75 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 18, color: 'white' }}>{item.title}</Text>
        <Text style={{ color: 'white' }}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <View>
      <Text style={{ fontWeight: 'bold', fontSize: 20, marginVertical: 20 }}>Événements</Text>
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
  const shopOffers: ShopOffer[] = [
    { id: '1', title: 'Pack de Chasses', description: 'Augmente ton nombre de chasses disponibles.' },
    { id: '2', title: 'Potion Magique', description: 'Potion pour améliorer tes chances.' },
  ];

  const renderShopOffer = (item: ShopOffer) => (
    <View style={{
      flex: 1,
      marginRight: 8,
      backgroundColor: '#fff',
      padding: 12,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    }}>
      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.title}</Text>
      <Text style={{ fontSize: 12 }}>{item.description}</Text>
    </View>
  );

  return (
    <View>
      <Text style={{ fontWeight: 'bold', fontSize: 20, marginVertical: 20 }}>Boutique</Text>

      <View style={{
        backgroundColor: '#ffff',
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
        {shopOffers.map((offer, index) => (
          <React.Fragment key={offer.id}>
            {renderShopOffer(offer)}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};