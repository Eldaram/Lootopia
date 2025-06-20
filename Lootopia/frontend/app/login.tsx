import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  Animated,
  StyleSheet,
} from "react-native";
import { storeSession } from "@/app/src/services/authService";
import { useRouter } from "expo-router";

const LoginScreen = () => {
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("admin");
  const [disabledMessage, setDisabledMessage] = useState("");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  const showDisabledAlert = (msg = "Compte désactivé") => {
    setDisabledMessage(msg);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setDisabledMessage(""));
    }, 3000);
  };

  const login = async () => {
    try {
      const res = await fetch("http://192.168.102.109:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.status === 403) {
        const { message } = await res.json(); 
        showDisabledAlert(message);
        return;
      }      

      const data = await res.json();

      if (data.success) {
        await storeSession(data.user);
        Alert.alert("Connecté en tant que", data.user.role);
        router.push("/");
      } else {
        Alert.alert("Erreur", "Identifiants incorrects");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Erreur serveur");
    }
  };

  return (
    <View style={{ padding: 20, position: 'relative', minHeight: 200 }}>
      {disabledMessage !== "" && (
        <Animated.View style={[styles.alertBox, { opacity: fadeAnim }]}>
          <Text style={styles.alertText}>{disabledMessage}</Text>
        </Animated.View>
      )}

      <Text>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      <Text>Mot de passe</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      <Button title="Connexion" onPress={login} />
    </View>
  );
};

const styles = StyleSheet.create({
  alertBox: {
    position: "absolute",
    top: 10,
    right: 10,
    alignSelf: "center", 
    backgroundColor: "#ff4d4f",
    padding: 10,
    borderRadius: 8,
    zIndex: 999,
    elevation: 10, 
  },
  alertText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default LoginScreen;
