import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface ProfileMenuProps {
  isLoggedIn: boolean;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ isLoggedIn }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [menuTranslateX] = useState(new Animated.Value(Dimensions.get('window').width));

  const toggleMenu = () => {
    if (isMenuVisible) {
      Animated.timing(menuTranslateX, {
        toValue: Dimensions.get('window').width,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsMenuVisible(false));
    } else {
      setIsMenuVisible(true);
      Animated.timing(menuTranslateX, {
        toValue: Dimensions.get('window').width * 0.3,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={toggleMenu}>
        <Icon name="user-circle" size={40} color="#555" />
      </TouchableOpacity>

      {isMenuVisible && (
        <Animated.View
          style={{
            position: 'absolute',
            top: 60,
            right: 0,
            bottom: 0,
            width: Dimensions.get('window').width * 0.7,
            backgroundColor: '#fff',
            padding: 16,
            transform: [{ translateX: menuTranslateX }],
            shadowColor: '#000',
            shadowOffset: { width: -2, height: 0 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          {isLoggedIn ? (
            <TouchableOpacity onPress={() => console.log('Navigating to logout')}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#e74c3c' }}>Se déconnecter</Text>
            </TouchableOpacity>
          ) : (
            <Text style={{ fontSize: 16, textAlign: 'center', color: '#555' }}>
              Il faut se connecter pour commencer à chasser !
            </Text>
          )}
        </Animated.View>
      )}
    </View>
  );
};

export default ProfileMenu;