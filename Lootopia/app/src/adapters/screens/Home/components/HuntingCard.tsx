import React, { useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const cardWidth = 550 + 300;

const HuntingCard = () => {
  const scrollRef = useRef<ScrollView>(null);
  const currentIndex = useRef(0);
  const totalCards = 4;

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
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 24, marginBottom: 12 }}>
        Chasses disponibles 🟢
      </Text>

       {/* TODO: Ajouter 2-3 ou 4 chasses dispo aléatoires */}

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={handlePrev}>
          <Icon name="chevron-left" size={30} color="#333" style={{ marginHorizontal: 10 }} />
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
                backgroundColor: '#ffff',
                borderRadius: 12,
                width: 550,
                height: 300,
                margin: 30,
                padding: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 5,
                elevation: 5,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{`Chasse ${item}`}</Text>
              <Text style={{ fontSize: 14, color: '#777', marginTop: 8 }}>
                {`Description courte de la chasse ${item}`}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity onPress={handleNext}>
          <Icon name="chevron-right" size={30} color="#333" style={{ marginHorizontal: 10 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HuntingCard;
