import React from 'react';
import { View, Text, Image } from 'react-native';
import { Colors } from '@/constants/Colors';

interface InfoCardProps {
  theme: typeof Colors.light;
}

export const InfoCard: React.FC<InfoCardProps> = ({ theme }) => {
  return (
    <View
      style={{
        height: 300,
        backgroundColor: theme.cardBackground, 
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        gap: 12,
      }}
    >
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Text
          style={{
            fontWeight: 'bold',
            marginBottom: 8,
            color: theme.text,
          }}
        >
          Achetez le !
        </Text>

        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/263/263115.png' }}
          style={{ width: 50, height: 50, marginVertical: 8 }}
        />
        <Text
          style={{
            fontWeight: 'bold',
            color: '#e67e22',
          }}
        >
          3,99 €
        </Text>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 12,
            marginTop: 4,
            color: theme.icon,
          }}
        >
          1500 Gemmes +{'\n'}3000 pièces d’or
        </Text>
      </View>

      <View style={{ flex: 1, alignItems: 'center' }}>
        <Text
          style={{
            fontWeight: 'bold',
            marginBottom: 8,
            color: theme.text, 
          }}
        >
          Mes derniers artéfacts
        </Text>

        <Text style={{ fontSize: 14, marginTop: 4, color: theme.icon }}>👁️ L’œil d’Astra</Text>
        <Text style={{ fontSize: 14, marginTop: 4, color: theme.icon }}>👁️ L’œil d’Astra</Text>
        <Text style={{ fontSize: 14, marginTop: 4, color: theme.icon }}>👁️ L’œil d’Astra</Text>
      </View>

      <View style={{ flex: 1, alignItems: 'center' }}>
        <Text
          style={{
            fontWeight: 'bold',
            marginBottom: 8,
            color: theme.text, 
          }}
        >
          Meilleurs Chasseurs
        </Text>

        <Text style={{ fontSize: 14, marginTop: 4, color: theme.icon }}>🥇 ShadowFlux</Text>
        <Text style={{ fontSize: 14, marginTop: 4, color: theme.icon }}>🥈 ShadowFlux</Text>
        <Text style={{ fontSize: 14, marginTop: 4, color: theme.icon }}>🥉 ShadowFlux</Text>
      </View>
    </View>
  );
};

