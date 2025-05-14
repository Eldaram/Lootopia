import React, { useRef, useState, useLayoutEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { InfoCard } from './InfoCard';

const totalCards = 5;

const EvenementCard = () => {
  const scrollRef = useRef<ScrollView>(null);
  const currentIndex = useRef(0);

  const [cardWidth, setCardWidth] = useState(Dimensions.get('window').width * 0.15);

  useLayoutEffect(() => {
    const updateCardWidth = () => {
      const screenWidth = Dimensions.get('window').width;
      setCardWidth(screenWidth * 0.15); 
    };

    updateCardWidth();

    const subscription = Dimensions.addEventListener('change', updateCardWidth);

    return () => {
      subscription.remove();
    };
  }, []);

  const scrollToCard = (index: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ x: index * cardWidth, animated: true });
    }
  };

  const handleNext = () => {
    if (currentIndex.current < totalCards - 1) {
      currentIndex.current += 1;
      scrollToCard(currentIndex.current);
    }
  };

  const handlePrev = () => {
    if (currentIndex.current > 0) {
      currentIndex.current -= 1;
      scrollToCard(currentIndex.current);
    }
  };

  return (
    <View style={{ flexDirection: 'row', marginTop: 34 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Évènements</Text>

      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        style={{ marginTop: 12 }}
      >
        {[1, 2, 3, 4, 5].map((item) => (
          <View
            key={item}
            style={{
              width: cardWidth, 
              margin: 15,
              backgroundColor: '#fff',
              borderRadius: 12,
              padding: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 5,
              elevation: 5,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{`Évènement ${item}`}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={{ flexDirection: 'row', marginTop: 12 }}>
        <TouchableOpacity onPress={handlePrev} style={{ marginHorizontal: 6 }}>
          <Icon name="chevron-left" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext} style={{ marginHorizontal: 6 }}>
          <Icon name="chevron-right" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 24 }}>
        <InfoCard />
      </View>
    </View>
  );
};

export default EvenementCard;
