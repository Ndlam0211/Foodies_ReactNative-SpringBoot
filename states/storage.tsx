import { MMKV } from "react-native-mmkv";
import { Storage } from "redux-persist";

// Tạo storage chính cho redux
const storage = new MMKV();

// Tạo một MMKV khác cho token với encryption
export const token_storage = new MMKV({
  id: "user_storage",
  encryptionKey: "RSA KEY",
});

// Adapter để dùng với redux-persist
const reduxStorage: Storage = {
  setItem: (key, value) => {
    storage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: (key) => {
    const value = storage.getString(key);
    return Promise.resolve(value ?? null); // redux-persist expects null when not found
  },
  removeItem: (key) => {
    storage.delete(key);
    return Promise.resolve();
  },
};

export default reduxStorage;
