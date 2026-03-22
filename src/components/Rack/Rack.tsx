import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import Sortable from "react-native-sortables";

import RackTile from "./RackTile";
import useRack from "./hooks/useRack";

export interface RackLetter {
  id: string;
  letter: string;
  played?: boolean;
}

export interface IRackProps {
  panelHeight: number;
}

const GAP = 6;

const Rack = ({ panelHeight }: IRackProps) => {
  const { lastAbsPos, rackRef, paddedData, tileSize, handleDragEnd } =
    useRack(panelHeight);

  const renderItem = useCallback(
    ({ item }: { item: RackLetter }) => {
      if (!item.letter) {
        return <View style={{ width: tileSize, height: tileSize }} />;
      }
      return (
        <Sortable.Handle>
          <RackTile item={item} tileSize={tileSize} />
        </Sortable.Handle>
      );
    },
    [tileSize],
  );

  return (
    <View ref={rackRef} style={[styles.rack, { height: tileSize }]}>
      <Sortable.Layer>
        <Sortable.Grid
          data={paddedData}
          columns={7}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          columnGap={GAP}
          customHandle
          strategy="insert"
          overDrag="both"
          activeItemScale={1.15}
          inactiveItemOpacity={1}
          inactiveItemScale={1}
          dragActivationDelay={0}
          dragActivationFailOffset={30}
          overflow="visible"
          onDragMove={({ touchData }) => {
            lastAbsPos.current = {
              x: touchData.absoluteX,
              y: touchData.absoluteY,
            };
          }}
          onDragEnd={({ key, data }) => {
            const letter = data.find((el) => el.id === key)?.letter;
            if (!letter) return;
            handleDragEnd(key, letter);
          }}
        />
      </Sortable.Layer>
    </View>
  );
};

export default Rack;

const styles = StyleSheet.create({
  rack: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
