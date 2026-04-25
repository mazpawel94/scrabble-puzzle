import LevelButton from "@/components/LevelButton";
import { getUserRank } from "@/storage/syncMeta";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function Home() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    getUserRank().then((rank) => {
      if (rank !== null) router.replace("/task/resume");
      else setChecking(false);
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
      {/* <Link href="/task/unknown" asChild>
        <LevelButton level="unknown" onPress={() => {}} />
      </Link> */}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 28, marginBottom: 40 },
});
