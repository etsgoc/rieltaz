import AsyncStorage from '@react-native-async-storage/async-storage';
import type { KV } from '@core';

export const store: KV = {
  get: key => AsyncStorage.getItem(key),
  set: (key, value) => AsyncStorage.setItem(key, value),
};
