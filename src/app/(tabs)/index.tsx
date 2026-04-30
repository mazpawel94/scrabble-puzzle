import { useAuth } from "@/auth/AuthContext";
import LevelButton from "@/components/LevelButton";
import {
  useGlobalActionsContext,
  useGlobalContext,
} from "@/contexts/GlobalContext";
import { getUserRank } from "@/storage/syncMeta";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const FirstView = () => (
  <>
    <Text style={styles.title}>Wybierz poziom trudności</Text>
    <Link href="/task/easy" asChild>
      <LevelButton level="easy" onPress={() => {}} />
    </Link>
    <Link href="/task/medium" asChild>
      <LevelButton level="medium" onPress={() => {}} />
    </Link>
    <Link href="/task/hard" asChild>
      <LevelButton level="hard" onPress={() => {}} />
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
  useEffect(() => {
    const isAdmin = userId === "aaea1d33-2b6a-4102-b4f9-3a68f2c9a75e";
    if (isAdmin) {
      setIsAdmin(true);
      setChecking(false);
    } else
      getUserRank().then((rank) => {
        if (rank !== null) router.replace("/task/resume");
        else {
          setChecking(false);
          setIsFirstTime(true);
        }
      });
  }, []);

  if (checking) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isFirstTime || isAdmin ? <FirstView /> : null}
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
