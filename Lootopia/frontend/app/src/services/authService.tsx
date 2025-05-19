import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeSession = async (user: any) => {
    await AsyncStorage.setItem("session", JSON.stringify(user));
};

export const getSession = async () => {
    const session = await AsyncStorage.getItem("session");
    return session ? JSON.parse(session) : null;
};

export const clearSession = async () => {
    await AsyncStorage.removeItem("session");
};
