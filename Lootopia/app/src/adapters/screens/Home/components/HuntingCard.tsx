import React, { useRef, useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Colors } from '@/constants/Colors';

const screenWidth = Dimensions.get('window').width;

interface HuntingCardProps {
  theme: typeof Colors.light;
}

const HuntingCard: React.FC<HuntingCardProps> = ({ theme }) => {
  const scrollRef = useRef<ScrollView>(null);
  const currentIndex = useRef(0);
  const totalCards = 4;

  const [cardWidth, setCardWidth] = useState(screenWidth * 0.3);

  useEffect(() => {
    const onResize = () => {
      const newWidth = Dimensions.get('window').width;
      setCardWidth(newWidth * 0.3);
    };
    const subscription = Dimensions.addEventListener('change', onResize);
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
    <View>
      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          marginTop: 24,
          marginBottom: 12,
          color: theme.text,
        }}
      >
        Chasses disponibles 🟢
      </Text>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={handlePrev}>
          <Icon name="chevron-left" size={30} color={theme.icon} style={{ marginHorizontal: 10 }} />
        </TouchableOpacity>

        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
        >
          {[1, 2, 3, 4].map((item) => (
            <TouchableOpacity
              key={item}
              style={{
                backgroundColor: theme.cardBackground,
                borderRadius: 12,
                width: cardWidth,
                height: 300,
                margin: 15,
                padding: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 5,
                elevation: 5,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text }}>
                {`Chasse ${item}`}
              </Text>
              <Text style={{ fontSize: 14, color: theme.icon, marginTop: 8 }}>
                {`Description courte de la chasse ${item}`}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity onPress={handleNext}>
          <Icon name="chevron-right" size={30} color={theme.icon} style={{ marginHorizontal: 10 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HuntingCard;
