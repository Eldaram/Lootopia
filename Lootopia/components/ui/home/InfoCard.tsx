import React from 'react';
import { View, Text, Image } from 'react-native';

export const InfoCard: React.FC = () => {
  return (
    <View
      style={{
        height: 300,
        backgroundColor: 'var(--card-background-color)',
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
            color: 'var(--text-color)',
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
            color: 'var(--icon-color)',
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
            color: 'var(--text-color)', 
          }}
        >
          Mes derniers artéfacts
        </Text>

        <Text style={{ fontSize: 14, marginTop: 4, color: 'var(--icon-color)' }}>👁️ L’œil d’Astra</Text>
        <Text style={{ fontSize: 14, marginTop: 4, color: 'var(--icon-color)' }}>👁️ L’œil d’Astra</Text>
        <Text style={{ fontSize: 14, marginTop: 4, color: 'var(--icon-color)' }}>👁️ L’œil d’Astra</Text>
      </View>

      <View style={{ flex: 1, alignItems: 'center' }}>
        <Text
          style={{
            fontWeight: 'bold',
            marginBottom: 8,
            color: 'var(--text-color)',
          }}
        >
          Meilleurs Chasseurs
        </Text>

        <Text style={{ fontSize: 14, marginTop: 4, color: 'var(--icon-color)' }}>🥇 ShadowFlux</Text>
        <Text style={{ fontSize: 14, marginTop: 4, color: 'var(--icon-color)' }}>🥈 ShadowFlux</Text>
        <Text style={{ fontSize: 14, marginTop: 4, color: 'var(--icon-color)' }}>🥉 ShadowFlux</Text>
      </View>
    </View>
  );
};

