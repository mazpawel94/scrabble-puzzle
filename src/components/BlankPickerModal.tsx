// BlankPickerModal.tsx
import React, { useState } from "react";
import { FlatList, StyleSheet, useWindowDimensions, View } from "react-native";
import {
  Button,
  Modal,
  Portal,
  Text,
  TouchableRipple,
  useTheme,
} from "react-native-paper";

const POLISH_ALPHABET = [
  "A",
  "Ą",
  "B",
  "C",
  "Ć",
  "D",
  "E",
  "Ę",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "Ł",
  "M",
  "N",
  "Ń",
  "O",
  "Ó",
  "P",
  "R",
  "S",
  "Ś",
  "T",
  "U",
  "W",
  "Y",
  "Z",
  "Ź",
  "Ż",
];

const NUM_COLUMNS = 6;

type Props = {
  onConfirm: (letter: string) => void;
};

const LetterCell = React.memo(
  ({
    letter,
    active,
    cellSize,
    onPress,
  }: {
    letter: string;
    active: boolean;
    cellSize: number;
    onPress: (l: string) => void;
  }) => {
    const theme = useTheme();
    return (
      <View
        style={{
          width: cellSize,
          height: cellSize,
          borderRadius: theme.roundness,
          backgroundColor: active
            ? theme.colors.primary
            : theme.colors.surfaceVariant,
          overflow: "hidden",
        }}
      >
        <TouchableRipple
          onPress={() => onPress(letter)}
          style={[
            styles.cell,
            {
              width: cellSize,
              height: cellSize,
              borderRadius: theme.roundness,
            },
          ]}
        >
          <Text
            style={{
              fontSize: cellSize * 0.4,
              fontWeight: active ? "700" : "400",
              color: active
                ? theme.colors.onPrimary
                : theme.colors.onSurfaceVariant,
            }}
          >
            {letter}
          </Text>
        </TouchableRipple>
      </View>
    );
  },
);

export const BlankPickerModal = ({ onConfirm }: Props) => {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const [selected, setSelected] = useState<string | null>(null);

  const cellSize = Math.floor(
    (width - 60 - (NUM_COLUMNS - 1) * 8) / NUM_COLUMNS,
  );

  const handleConfirm = () => {
    if (!selected) return;
    onConfirm(selected);
    setSelected(null);
  };

  const handleDismiss = () => {
    setSelected(null);
  };

  return (
    <Portal>
      <Modal
        visible={true}
        onDismiss={handleDismiss}
        contentContainerStyle={[
          styles.modal,
          { backgroundColor: theme.colors.surface },
        ]}
      >
        <Text variant="titleMedium" style={styles.title}>
          Zdefiniuj blanka
        </Text>

        <FlatList
          data={POLISH_ALPHABET}
          keyExtractor={(item) => item}
          numColumns={NUM_COLUMNS}
          scrollEnabled={false}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.grid}
          extraData={selected}
          renderItem={({ item }) => (
            <LetterCell
              letter={item}
              active={item === selected}
              cellSize={cellSize}
              onPress={setSelected}
            />
          )}
        />

        <Button
          mode="contained"
          onPress={handleConfirm}
          disabled={!selected}
          style={styles.button}
        >
          OK
        </Button>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 10,
    borderRadius: 16,
    padding: 20,
  },
  title: {
    textAlign: "center",
    marginBottom: 16,
  },
  grid: {
    gap: 8,
  },
  row: {
    gap: 8,
    justifyContent: "center",
  },
  cell: {
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    marginTop: 20,
  },
});
