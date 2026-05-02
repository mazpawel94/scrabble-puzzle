import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { Surface, Text, TouchableRipple, useTheme } from "react-native-paper";

const CollectionTile = ({
  icon,
  label,
  onPress,
}: {
  icon: string;
  label: string;
  onPress: () => void;
}) => {
  const theme = useTheme();
  return (
    <TouchableRipple
      onPress={onPress}
      borderless
      style={{ borderRadius: 8, flex: 1 }}
    >
      <Surface
        style={{
          borderRadius: 8,
          backgroundColor: theme.colors.secondaryContainer,
          padding: 16,
          flexDirection: "row",
          alignItems: "stretch",
          minHeight: 80,
        }}
        elevation={0}
      >
        {/* lewa kolumna 30% - ikona wyśrodkowana */}
        <View
          style={{
            width: "30%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MaterialCommunityIcons
            name={icon as any}
            size={28}
            color={theme.colors.onSecondaryContainer}
          />
        </View>

        {/* prawa kolumna 70% - tekst + strzałka w prawym dolnym rogu */}
        <View
          style={{
            width: "70%",
            justifyContent: "space-between",
          }}
        >
          <Text
            variant="labelLarge"
            style={{
              color: theme.colors.onSecondaryContainer,
              margin: "auto",
              textAlign: "center",
            }}
          >
            {label}
          </Text>
          <View style={{ position: "absolute", bottom: -15, right: -10 }}>
            <MaterialCommunityIcons
              name="arrow-right"
              size={18}
              color={theme.colors.onSecondaryContainer}
              style={{ opacity: 0.5 }}
            />
          </View>
        </View>
      </Surface>
    </TouchableRipple>
  );
};

export default CollectionTile;
