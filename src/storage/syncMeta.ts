import AsyncStorage from "@react-native-async-storage/async-storage";

const LAST_SYNCED_KEY = "sync:last_synced_at";
const USER_RANK_KEY = "user:rank";

export async function getLastSyncedAt(): Promise<string | null> {
  return AsyncStorage.getItem(LAST_SYNCED_KEY);
}

export async function setLastSyncedAt(isoDate: string): Promise<void> {
  return AsyncStorage.setItem(LAST_SYNCED_KEY, isoDate);
}

export async function getUserRank(): Promise<number | null> {
  const value = await AsyncStorage.getItem(USER_RANK_KEY);
  return value ? parseFloat(value) : null;
}

export async function setUserRank(rank: number): Promise<void> {
  return AsyncStorage.setItem(USER_RANK_KEY, String(rank));
}
