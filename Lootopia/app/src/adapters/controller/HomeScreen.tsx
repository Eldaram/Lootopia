import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { GetWelcomeMessage } from '../../application/usecases/GetWelcomeMessage';

export const HomeScreen = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchMessage = async () => {
      const result = await GetWelcomeMessage();
      setMessage(result.text);
    };
    fetchMessage();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{message}</Text>
      <Button title="Changer le message" onPress={() => setMessage('Nouveau message !')} />
    </View>
  );
};
