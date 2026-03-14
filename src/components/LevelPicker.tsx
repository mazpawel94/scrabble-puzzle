import { StyleSheet, View } from "react-native";
import { Text, TouchableRipple, useTheme } from "react-native-paper";

type Props = {
  value: number;
  onChange: (val: number) => void;
};

export const LevelPicker = ({ value, onChange }: Props) => {
  const theme = useTheme();

  return (
    <View style={styles.row}>
      {Array.from({ length: 10 }, (_, i) => {
        const val = i + 1;
        const active = val === value;
        return (
          <TouchableRipple
            key={val}
            onPress={() => onChange(val)}
            style={[
              styles.cell,
              {
                backgroundColor: active
                  ? theme.colors.primary
                  : theme.colors.surfaceVariant,
                borderRadius: theme.roundness,
              },
            ]}
          >
            <Text
              style={{
                color: active
                  ? theme.colors.onPrimary
                  : theme.colors.onSurfaceVariant,
                fontSize: 13,
                fontWeight: active ? "700" : "400",
                textAlign: "center",
              }}
            >
              {val}
            </Text>
          </TouchableRipple>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 4,
  },
  cell: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
