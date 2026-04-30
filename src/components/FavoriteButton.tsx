import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";

const FavoriteButton = ({
  onToggle,
}: {
  onToggle?: (val: boolean) => void;
}) => {
  const [liked, setLiked] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    // animacja "bum"
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 1.4,
        useNativeDriver: true,
        speed: 50,
      }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20 }),
    ]).start();

    const next = !liked;
    setLiked(next);
    onToggle?.(next);
  };

  return (
    <>
      <TouchableRipple onPress={handlePress} borderless style={styles.ripple}>
        <View style={styles.row}>
          <Text
            variant="labelLarge"
            style={{
              color: "black",
              marginRight: 8,
            }}
          >
            {liked ? "Dodano do ulubionych" : "Dodaj do ulubionych"}
          </Text>
          <Animated.View style={{ transform: [{ scale }] }}>
            <MaterialCommunityIcons
              name={liked ? "heart" : "heart-outline"}
              size={24}
              color={"#e03131"}
            />
          </Animated.View>
        </View>
      </TouchableRipple>
    </>
  );
};

export default FavoriteButton;

const styles = StyleSheet.create({
  ripple: {
    borderRadius: 8,
    padding: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});
