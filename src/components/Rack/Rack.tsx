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
  const { rackRef, paddedData, tileSize, handleDragEnd, handleDragMove } =
    useRack(panelHeight);

  const renderItem = useCallback(
    ({ item }: { item: RackLetter }) => {
      // Górny wiersz bufora — fixed-order, całkowicie niewidoczny
      if (item.id.startsWith("__buffer_"))
        return (
          <Sortable.Handle mode="fixed-order">
            <View style={{ width: tileSize, height: tileSize }} />
          </Sortable.Handle>
        );
      // Pusty slot — niedraggowalny
      if (!item.letter)
        return <View style={{ width: tileSize, height: tileSize }} />;
      // Normalna płytka
      return (
        <Sortable.Handle>
          <RackTile item={item} tileSize={tileSize} />
        </Sortable.Handle>
      );
    },
    [tileSize],
  );

  return (
    <View
      style={[styles.rack, { height: tileSize * 2 }]}
      pointerEvents="box-none"
    >
      <View ref={rackRef} style={{ marginTop: -tileSize }}>
        <Sortable.Layer>
          <Sortable.Grid
            data={paddedData}
            columns={7}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            columnGap={GAP}
            rowGap={0}
            customHandle
            strategy="insert"
            overDrag="both"
            activeItemScale={1.15}
            inactiveItemOpacity={1}
            inactiveItemScale={1}
            dragActivationDelay={0}
            dragActivationFailOffset={30}
            overflow="visible"
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
          />
        </Sortable.Layer>
      </View>
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
