import { useCallback, useEffect, useMemo } from "react";
import { Gesture } from "react-native-gesture-handler";
import {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { ITileRackProps } from "../RackTile";

const SPRING = { damping: 22, stiffness: 350, mass: 0.8 };

const useRackTile = ({
  item,
  rackY,
  targetX,
  onDragMove,
  onDragEnd,
}: ITileRackProps) => {
  const { letter, id } = item;

  const isBlank = useMemo(
    () => letter !== "?" && letter === letter.toLowerCase(),
    [letter],
  );
  const displayLetter = useMemo(() => letter.toUpperCase(), [letter]);

  const posX = useSharedValue(targetX);
  const posY = useSharedValue(0);
  const scale = useSharedValue(1);
  const zIdx = useSharedValue(1);
  const dragging = useSharedValue(false);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  const doMove = useCallback(
    (posX: number, absX: number, absY: number) =>
      onDragMove(id, letter, posX, absX, absY),
    [onDragMove, id, letter],
  );
  const doEnd = useCallback(
    (absX: number, absY: number, finalPosX: number) =>
      onDragEnd(id, letter, absX, absY, finalPosX),
    [onDragEnd, id, letter],
  );

  const gesture = useMemo(() => {
    const pan = Gesture.Pan()
      .onStart(() => {
        dragging.value = true;
        startX.value = posX.value;
        startY.value = posY.value;
        scale.value = withSpring(1.15, SPRING);
        zIdx.value = 100;
      })
      .onUpdate((e) => {
        posX.value = startX.value + e.translationX;
        posY.value = startY.value + e.translationY;
        runOnJS(doMove)(posX.value, e.absoluteX, rackY + e.y + e.translationY);
      })
      .onEnd((e) => {
        dragging.value = false;
        const finalPosX = posX.value; // ← zapamiętujemy pozycję przed snapem
        posX.value = withSpring(targetX, SPRING);
        posY.value = withSpring(0, SPRING);
        scale.value = withSpring(1, SPRING);
        zIdx.value = 1;

        runOnJS(doEnd)(e.absoluteX, rackY + e.y + e.translationY, finalPosX);
      });

    const tap = Gesture.Tap().maxDuration(250);
    return Gesture.Exclusive(pan, tap);
  }, [rackY, doMove, doEnd]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: posX.value },
      { translateY: posY.value },
      { scale: scale.value },
    ],
    zIndex: zIdx.value,
  }));

  useEffect(() => {
    if (!dragging.value) {
      posX.value = withSpring(targetX, SPRING);
    }
  }, [targetX]);

  return { gesture, animStyle, isBlank, displayLetter };
};

export default useRackTile;
