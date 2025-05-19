import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeSession = async (user: any) => {
  try {
    console.log("Storing session:", user);
    await AsyncStorage.setItem("session", JSON.stringify(user));
  } catch (e) {
    console.error("Erreur stockage session:", e);
  }
};

export const getSession = async () => {
  try {
    const session = await AsyncStorage.getItem("session");
    console.log("Fetched session:", session);
    return session ? JSON.parse(session) : null;
  } catch (e) {
    console.error("Erreur lecture session:", e);
    return null;
  }
};

export const clearSession = async () => {
  try {
    await AsyncStorage.removeItem("session");
  } catch (e) {
    console.error("Erreur suppression session:", e);
  }
};
