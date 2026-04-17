import * as SecureStore from "expo-secure-store";

const JWT_KEY = "jwt_token";
const DEVICE_TOKEN_KEY = "device_token";

export const storage = {
  getJwt: () => SecureStore.getItemAsync(JWT_KEY),
  setJwt: (token: string) => SecureStore.setItemAsync(JWT_KEY, token),
  deleteJwt: () => SecureStore.deleteItemAsync(JWT_KEY),

  getDeviceToken: () => SecureStore.getItemAsync(DEVICE_TOKEN_KEY),
  setDeviceToken: (token: string) =>
    SecureStore.setItemAsync(DEVICE_TOKEN_KEY, token),
};
