// import React from 'react';
// import { View, Text } from 'react-native';
// import { ScrollView } from 'react-native-gesture-handler';
// import { InfoCard } from './InfoCard';

// const EvenementCard = () => {
//   return (
//     <View style={{ flexDirection: 'row', marginTop: 24, gap: 16 }}>
//                   <ScrollView
//                   horizontal
//                    showsHorizontalScrollIndicator={false}
//                   >
//                     <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
//                       Évènements
//                     </Text>
//                       <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12, backgroundColor: '#ffff',}}></ScrollView>
//                       </ScrollView>
    
//                       <View style={{ width: 500 }}>
//                         <InfoCard />
//                       </View>
//                 </View>
//   );
// };

// export default EvenementCard;

import React, { useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { InfoCard } from './InfoCard';

const cardWidth = 500 + 40; // largeur + margin total
const totalCards = 4;

const EvenementCard = () => {
  const scrollRef = useRef<ScrollView>(null);
  const currentIndex = useRef(0);

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
    <View style={{  flexDirection: 'row',marginTop: 34 }}>
         <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Évènements</Text>

      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
      >
        {[1, 2, 3, 4, 5].map((item) => (
          <View
            key={item}
            style={{
              width: 230,
              margin: 30,
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
          </View>
        ))}
      </ScrollView>
      <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={handlePrev} style={{ marginHorizontal: 6 }}>
            <Icon name="chevron-left" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNext} style={{ marginHorizontal: 6 }}>
            <Icon name="chevron-right" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      <View style={{ width: 700 }}>
            <InfoCard />
        </View>
    </View>
  );
};

export default EvenementCard;
