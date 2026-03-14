import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

type Action = {
  icon: string;
  label: string;
  onPress: () => void;
  disabled?: boolean;
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
          backgroundColor: theme.colors.surface,
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
            color={
              action.disabled
                ? theme.colors.onSurfaceDisabled
                : theme.colors.onSurface
            }
          />
          <Text
            variant="labelSmall"
            style={{
              color: action.disabled
                ? theme.colors.onSurfaceDisabled
                : theme.colors.onSurface,
            }}
          >
            {action.label}
          </Text>
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
