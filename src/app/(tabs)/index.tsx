import { Link, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/auth/AuthContext";
import LevelButton from "@/components/LevelButton";
import {
  useGlobalActionsContext,
  useGlobalContext,
} from "@/contexts/GlobalContext";
import HomeScreen from "@/screens/homeScreen/HomeScreen";
import { getUserRank } from "@/storage/syncMeta";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const FirstView = ({ callback }: { callback: () => void }) => (
  <>
    <Text style={styles.title}>Wybierz poziom trudności</Text>
    <Link href="/task/easy" asChild>
      <LevelButton level="easy" onPress={callback} />
    </Link>
    <Link href="/task/medium" asChild>
      <LevelButton level="medium" onPress={callback} />
    </Link>
    <Link href="/task/hard" asChild>
      <LevelButton level="hard" onPress={callback} />
    </Link>
  </>
);

export default function Home() {
  const { userId } = useAuth();
  const { isAdmin } = useGlobalContext();
  const { setIsAdmin } = useGlobalActionsContext();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  const [isFirstTime, setIsFirstTime] = useState<boolean | undefined>(
    undefined,
  );
  const callback = useCallback(() => setIsFirstTime(false), []);

  useEffect(() => {
    const isAdmin = userId === "aaea1d33-2b6a-4102-b4f9-3a68f2c9a75e";
    if (isAdmin) {
      setIsAdmin(true);
      setChecking(false);
    } else
      getUserRank().then((rank) => {
        setIsFirstTime(rank === null);
        // router.replace("/task/resume");
        setChecking(false);
      });
  }, []);

  if (checking) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isFirstTime === false) return <HomeScreen />;

  return (
    <View style={styles.container}>
      {isFirstTime || isAdmin ? <FirstView callback={callback} /> : null}
      {isAdmin ? (
        <Link href="/task/unknown" asChild>
          <LevelButton level="unknown" onPress={() => {}} />
        </Link>
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 28, marginBottom: 40 },
});
