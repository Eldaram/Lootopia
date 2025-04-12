import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TouchableWithoutFeedback, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SideMenu } from './SideMenu';

export const HomeScreen = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuTranslateX] = useState(new Animated.Value(0));

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

  const handleMenuOpen = () => {
    setIsMenuOpen(true);

    Animated.timing(menuTranslateX, {
      toValue: 420,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={{ flex: 1 }}>
      {isMenuOpen && <SideMenu onClose={() => setIsMenuOpen(false)} />}
      <TouchableWithoutFeedback onPress={handleOutsidePress}>
        <View style={{ flex: 1 }}>
          <Animated.ScrollView
            style={{
              flex: 1,
              padding: 16,
              backgroundColor: '#fff',
              marginLeft: menuTranslateX,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <TouchableOpacity onPress={handleMenuOpen}>
                <Icon name="bars" size={30} color="#555" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Icon name="user-circle" size={40} color="#555" />
              </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 24, marginBottom: 12 }}>Chasses disponibles 🟢</Text>
            <View style={{ backgroundColor: '#f5f5f5', padding: 16, borderRadius: 12, marginBottom: 24 }}></View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 24, marginBottom: 12 }}>Évènements</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}></ScrollView>
          </Animated.ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};
