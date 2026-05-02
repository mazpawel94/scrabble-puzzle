import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Badge, Text, useTheme } from "react-native-paper";

type Action = {
  icon: string;
  label: string;
  onPress: () => void;
  disabled?: boolean;
  number?: number;
};

type Props = {
  actions: Action[];
};

export const ActionBar = ({ actions }: Props) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.onSurface,
          borderTopColor: theme.colors.surfaceVariant,
        },
      ]}
    >
      {actions.map((action) => (
        <TouchableOpacity
          key={action.label}
          onPress={action.onPress}
          disabled={action.disabled}
          style={styles.item}
        >
          <MaterialCommunityIcons
            name={action.icon as any}
            size={24}
            color={action.disabled ? theme.colors.surface : "white"}
          />
          <Text
            variant="labelSmall"
            style={{
              color: action.disabled ? theme.colors.surface : "white",
            }}
          >
            {action.label}
          </Text>
          {action.number ? (
            <Badge
              style={{
                position: "absolute",
                top: 0,
                right: 5,
                opacity: action.disabled ? 0.5 : 1,
                color: "white",
              }}
            >
              {action.number}
            </Badge>
          ) : null}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderTopWidth: 0.5,
    paddingBottom: 8,
    paddingTop: 8,
    opacity: 0.8,
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 4,
  },
});
