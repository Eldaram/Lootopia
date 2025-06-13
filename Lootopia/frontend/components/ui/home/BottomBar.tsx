import { View, TouchableOpacity, Text, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter } from 'expo-router';

export const BottomBar = () => {
  const router = useRouter(); 

  return (
    <View style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 70,
      flexDirection: 'row',
      backgroundColor: '#9B9B9B',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingBottom: 10,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    }}>
      <TouchableOpacity
        style={{ alignItems: 'center' }}
        onPress={() => router.push('/')}  
      >
        <Icon name="edit" size={24} color="#fff" />
        <Text style={{ color: '#fff', fontSize: 12, marginTop: 4 }}>Modifier</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ alignItems: 'center' }}
        onPress={() => router.push('/')}  
      >
        <Icon name="search" size={24} color="#fff" />
        <Text style={{ color: '#fff', fontSize: 12, marginTop: 4 }}>Rechercher</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ alignItems: 'center', zIndex: 1 }}
        onPress={() => router.push('/')}
      >
        <Image
          source={require('@/assets/images/home-logo.png')}
          style={{
            width: '200%',
            height: 150,
            marginBottom: 80,
            alignSelf: 'center',
          }}
        />
        <Text style={{ color: '#fff', fontSize: 12, marginTop: 4 }}>Accueil</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ alignItems: 'center' }}
        onPress={() => router.push('/shop')}  
      >
        <Icon name="shopping-cart" size={24} color="#fff" />
        <Text style={{ color: '#fff', fontSize: 12, marginTop: 4 }}>Boutique</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ alignItems: 'center' }}
        onPress={() => router.push('/artefacts')} 
      >
        <Icon name="search" size={24} color="#fff" />
        <Text style={{ color: '#fff', fontSize: 12, marginTop: 4 }}>Artefacts</Text>
      </TouchableOpacity>
    </View>
  );
};
