import AsyncStorage from "@react-native-async-storage/async-storage";

const LAST_SYNCED_KEY = "sync:last_synced_at";

export async function getLastSyncedAt(): Promise<string | null> {
  return AsyncStorage.getItem(LAST_SYNCED_KEY);
}

export async function setLastSyncedAt(isoDate: string): Promise<void> {
  return AsyncStorage.setItem(LAST_SYNCED_KEY, isoDate);
}
