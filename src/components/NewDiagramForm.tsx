import { useGlobalContext } from "@/contexts/GlobalContext";
import { postDiagram } from "@/services/api";
import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Chip,
  Divider,
  Modal,
  Portal,
  SegmentedButtons,
  Text,
} from "react-native-paper";
import { LevelPicker } from "./LevelPicker";

const LEXICON_OPTIONS = [
  { value: "sjp", label: "sjp" },
  { value: "osps50", label: "osps50" },
  { value: "osps52", label: "osps52" },
];

const AVAILABLE_TAGS = [
  "OSPS52",
  "sklejki",
  "słownictwo",
  "mostek",
  "przedłużka",
];

const NewDiagramForm = ({ closeForm }: { closeForm: () => void }) => {
  const { currentTask, currentLetters } = useGlobalContext();

  const [level, setLevel] = useState(5);
  const [lexicon, setLexicon] = useState("osps52");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }, []);

  const handleCancel = () => {
    setLevel(5);
    setLexicon("osps52");
    setSelectedTags([]);
    closeForm();
  };

  const handleSave = async () => {
    const object = {
      level,
      letters: currentLetters,
      diagramIsPublic: true,
      tags: selectedTags.map((el) => ({ id: el, text: el })),
      solution: JSON.stringify(currentTask!.solution),
      words: JSON.stringify(
        currentTask!.words.map((el) => ({
          coordinates: el.coordinates,
          word: el.word,
        })),
      ),
    };
    const res = await postDiagram(object);
    if (res) closeForm();
  };
  return (
    <Portal>
      <Modal
        visible={true}
        onDismiss={handleCancel}
        contentContainerStyle={styles.modal}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text variant="titleMedium" style={styles.title}>
            Nowy diagram
          </Text>

          {/* LEVEL */}
          <View style={styles.field}>
            <Text variant="labelMedium" style={styles.label}>
              Poziom :<Text style={styles.levelValue}>{Math.round(level)}</Text>
            </Text>

            <LevelPicker value={level} onChange={setLevel} />
            <View style={styles.sliderRange}>
              <Text variant="labelSmall" style={styles.rangeLabel}>
                1
              </Text>
              <Text variant="labelSmall" style={styles.rangeLabel}>
                10
              </Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          {/* LEXICON */}
          <View style={styles.field}>
            <Text variant="labelMedium" style={styles.label}>
              Słownik
            </Text>
            <SegmentedButtons
              value={lexicon}
              onValueChange={setLexicon}
              buttons={LEXICON_OPTIONS}
              style={styles.segmented}
            />
          </View>

          <Divider style={styles.divider} />

          {/* TAGS */}
          <View style={styles.field}>
            <Text variant="labelMedium" style={styles.label}>
              Tagi
            </Text>
            <View style={styles.chipContainer}>
              {AVAILABLE_TAGS.map((tag) => {
                const active = selectedTags.includes(tag);
                return (
                  <Chip
                    key={tag}
                    selected={active}
                    onPress={() => toggleTag(tag)}
                    style={styles.chip}
                    showSelectedCheck
                  >
                    {tag}
                  </Chip>
                );
              })}
            </View>
          </View>

          <Divider style={styles.divider} />

          {/* ACTIONS */}
          <View style={styles.actions}>
            <Button
              mode="outlined"
              onPress={handleCancel}
              style={styles.actionBtn}
            >
              Anuluj
            </Button>
            <Button
              mode="contained"
              onPress={handleSave}
              style={styles.actionBtn}
            >
              Zapisz
            </Button>
          </View>
        </ScrollView>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "white",
    borderRadius: 16,
    margin: 20,
    padding: 24,
  },
  title: {
    marginBottom: 20,
    fontWeight: "600",
  },
  field: {
    marginBottom: 4,
  },
  label: {
    marginBottom: 10,
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  levelValue: {
    color: "#000",
    fontWeight: "700",
  },
  slider: {
    marginHorizontal: -4,
  },
  sliderRange: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2,
  },
  rangeLabel: {
    color: "#999",
  },
  segmented: {
    marginTop: 4,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    marginBottom: 4,
  },
  divider: {
    marginVertical: 16,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 8,
  },
  actionBtn: {
    minWidth: 100,
  },
});

export default NewDiagramForm;
