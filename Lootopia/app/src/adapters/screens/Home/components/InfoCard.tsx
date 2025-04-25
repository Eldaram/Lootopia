import React from 'react';
import { View, Text, Image } from 'react-native';

export const InfoCard = () => {
  return (
    <View
      style={{
        height: 300,
        backgroundColor: '#fff',
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
        <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Achetez le !</Text>

          {/* TODO: ajouter 1 élément de la boutique aléatoire */}
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/263/263115.png' }}
          style={{ width: 50, height: 50, marginVertical: 8 }}
        />
        <Text style={{ fontWeight: 'bold', color: '#e67e22' }}>3,99 €</Text>
        <Text style={{ textAlign: 'center', fontSize: 12, marginTop: 4 }}>
          1500 Gemmes +{'\n'}3000 pièces d’or
        </Text>
      </View>

      <View style={{ flex: 1, alignItems: 'center' }}>
        <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Mes derniers artéfacts</Text>

        {/* TODO: ajouter les 3 derniers artéfacts obtenus */}
        <Text style={{ fontSize: 14, marginTop: 4 }}>👁️ L’œil d’Astra</Text>
        <Text style={{ fontSize: 14, marginTop: 4 }}>👁️ L’œil d’Astra</Text>
        <Text style={{ fontSize: 14, marginTop: 4 }}>👁️ L’œil d’Astra</Text>
      </View>

      <View style={{ flex: 1, alignItems: 'center' }}>
        <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Meilleurs Chasseurs</Text>

         {/* TODO: ajouter les 3 meilleurs chasseurs du monde*/}
        <Text style={{ fontSize: 14, marginTop: 4 }}>🥇 ShadowFlux</Text>
        <Text style={{ fontSize: 14, marginTop: 4 }}>🥈 ShadowFlux</Text>
        <Text style={{ fontSize: 14, marginTop: 4 }}>🥉 ShadowFlux</Text>
      </View>
    </View>
  );
};

export default InfoCard;