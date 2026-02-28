import LevelButton from "@/components/LevelButton";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wybierz poziom trudności</Text>
      <Link href="./(tabs)/easy" asChild>
        <LevelButton level="easy" onPress={() => {}} />
      </Link>
      <Link href="./(tabs)/medium" asChild>
        <LevelButton level="medium" onPress={() => {}} />
      </Link>
      <Link href="./(tabs)/hard" asChild>
        <LevelButton level="hard" onPress={() => {}} />
      </Link>
      <Link href="./(tabs)/unknown" asChild>
        <LevelButton level="unknown" onPress={() => {}} />
      </Link>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 28, marginBottom: 40 },
});
