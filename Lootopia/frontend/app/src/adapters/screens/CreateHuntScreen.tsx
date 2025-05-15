import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.API_URL;


const CreateHuntScreen = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    world: '1',
    duration: '',
    mode: '1',
    max_participants: '10',
    chat_enabled: true,
    map_id: '1',
    participation_fee: '0',
    search_delay: '00:01:00',
    partner_id: '',
  });

  
console.log(API_URL);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.partner_id.trim()) {
      if (Platform.OS === 'web') {
        window.alert('Le titre et le créateur (partner_id) sont requis.');
      } else {
        Alert.alert('Erreur', 'Le titre et le créateur (partner_id) sont requis.');
      }
      return;
    }
    

    const payload = {
      ...form,
      world: Number(form.world),
      mode: Number(form.mode),
      max_participants: Number(form.max_participants),
      participation_fee: Number(form.participation_fee),
      chat_enabled: form.chat_enabled,
      map_id: Number(form.map_id),
      partner_id: Number(form.partner_id),
      duration: form.duration ? new Date(form.duration) : undefined,
    };

    try {
      const response = await fetch(API_URL+"/hunts", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Ajoutez d'autres en-têtes si nécessaire
        },
        body: JSON.stringify(payload),
        // Ajoutez cette option si vous utilisez des cookies
        credentials: 'include', 
      });

      if (response.ok) {
        const result = await response.json();
        Alert.alert('Succès', 'Chasse créée avec succès !');
        console.log(result);
      } else {
        const error = await response.json();
        Alert.alert('Erreur', error.error || 'Erreur lors de la création.');
      }
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de contacter le serveur.');
      console.error(err);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Créer une chasse
      </Text>

      <Text>Titre *</Text>
      <TextInput
        value={form.title}
        onChangeText={(text) => handleChange('title', text)}
        style={inputStyle}
      />

      <Text>Description</Text>
      <TextInput
        value={form.description}
        onChangeText={(text) => handleChange('description', text)}
        style={inputStyle}
      />

      <Text>Durée (date de fin, format ISO)</Text>
      <TextInput
        value={form.duration}
        onChangeText={(text) => handleChange('duration', text)}
        style={inputStyle}
        placeholder="2025-12-01T12:00:00"
      />

      <Text>Nombre max de participants</Text>
      <TextInput
        value={form.max_participants}
        onChangeText={(text) => handleChange('max_participants', text)}
        style={inputStyle}
        keyboardType="numeric"
      />

      <Text>Frais de participation (€)</Text>
      <TextInput
        value={form.participation_fee}
        onChangeText={(text) => handleChange('participation_fee', text)}
        style={inputStyle}
        keyboardType="numeric"
      />

      <Text>Partner ID (créateur) *</Text>
      <TextInput
        value={form.partner_id}
        onChangeText={(text) => handleChange('partner_id', text)}
        style={inputStyle}
        keyboardType="numeric"
      />

      <View style={{ marginVertical: 20 }}>
        <Button title="Créer la chasse" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
};

const inputStyle = {
  borderWidth: 1,
  borderColor: '#ccc',
  padding: 8,
  marginVertical: 8,
  borderRadius: 5,
};

export default CreateHuntScreen;
