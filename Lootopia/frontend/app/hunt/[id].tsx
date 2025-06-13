import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';

export default function HuntDetailScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Détail de la chasse #{id}</Text>
    </View>
  );
}
