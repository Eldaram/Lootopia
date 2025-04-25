import React, { useRef, useState, useLayoutEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { InfoCard } from './InfoCard';
import { Colors } from '@/constants/Colors';

interface EvenementCardProps {
  theme: typeof Colors.light; 
}

const EvenementCard: React.FC<EvenementCardProps> = ({ theme }) => {
  const totalCards = 5;
  const scrollRef = useRef<ScrollView>(null);
  const currentIndex = useRef(0);

  const [cardWidth, setCardWidth] = useState(Dimensions.get('window').width * 0.3);

  useLayoutEffect(() => {
    const updateCardWidth = () => {
      const screenWidth = Dimensions.get('window').width;
      setCardWidth(screenWidth * 0.3);
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
    <View style={{ flexDirection: 'column', marginTop: 34 }}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: theme.text,
          marginBottom: 12,
        }}
      >
        Évènements
      </Text>

      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={handlePrev} style={{ marginHorizontal: 6 }}>
            <Icon name="chevron-left" size={24} color={theme.icon} />
          </TouchableOpacity>

          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            style={{ flex: 1 }}
          >
            <View style={{ flexDirection: 'row' }}>
              {[1, 2, 3, 4, 5].map((item) => (
                <View
                  key={item}
                  style={{
                    width: cardWidth,
                    marginHorizontal: 10,
                    backgroundColor: theme.cardBackground, 
                    borderRadius: 12,
                    padding: 16,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 5,
                    elevation: 5,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      color: theme.text, 
                    }}
                  >
                    {`Évènement ${item}`}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>

          <TouchableOpacity onPress={handleNext} style={{ marginHorizontal: 6 }}>
            <Icon name="chevron-right" size={24} color={theme.icon} />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, marginLeft: 16 }}>
          <InfoCard theme={theme} />
        </View>
      </View>
    </View>
  );
};

export default EvenementCard;
