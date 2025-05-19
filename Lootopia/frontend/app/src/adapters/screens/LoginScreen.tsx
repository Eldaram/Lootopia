import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useLocation } from "wouter"; // ← ici
import { storeSession } from "@/app/src/services/authService";

const LoginScreen = () => {
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("admin");
  const [_, setLocation] = useLocation(); // ← ici

  const login = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        await storeSession(data.user);
        Alert.alert("Connecté en tant que", data.user.role);
        setLocation("/dashboard");
      } else {
        Alert.alert("Erreur", "Identifiants incorrects");
      }
        
    } catch (err) {
      console.error(err);
      Alert.alert("Erreur serveur");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Email</Text>
      <TextInput value={email} onChangeText={setEmail} style={{ borderWidth: 1 }} />
      <Text>Mot de passe</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry style={{ borderWidth: 1 }} />
      <Button title="Connexion" onPress={login} />
    </View>
  );
};

export default LoginScreen;
