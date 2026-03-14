import React, { RefObject } from "react";
import { StyleSheet, View } from "react-native";
import RackTile from "./RackTile";
import useRack, { calcX, GAP } from "./hooks/useRack";

export interface RackLetter {
  id: string;
  letter: string;
  played?: boolean;
}

export interface IRackProps {
  panelHeight: number;
  onDragMove?: (id: string, letter: string, absX: number, absY: number) => void;
  containerRef: RefObject<View>;
}
const Rack = (props: IRackProps) => {
  const {
    rackRef,
    rackY,
    tileSize,
    width,
    visible,
    handleDragMove,
    handleDragEnd,
    handleOnLayout,
  } = useRack(props);

  return (
    <View
      ref={rackRef}
      style={[styles.rack, { height: tileSize }]}
      onLayout={handleOnLayout}
    >
      {visible.map((item, index) => {
        const tx = calcX(index, tileSize, GAP, visible.length, width);
        return (
          <RackTile
            key={item.id}
            item={item}
            tileSize={tileSize}
            targetX={tx}
            rackY={rackY.current}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
          />
        );
      })}
    </View>
  );
};

export default Rack;

const styles = StyleSheet.create({
  rack: {
    width: "100%",
    position: "relative",
    display: "flex",
    justifyContent: "center",
  },
});
