import React from "react";
import { StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDecay,
    withTiming,
} from "react-native-reanimated";

interface ZoomablePanViewProps {
  children: React.ReactNode;
  /** Szerokość contentu (np. plansza + guttery) */
  contentWidth: number;
  /** Wysokość contentu */
  contentHeight: number;
  /** Szerokość widocznego obszaru (ekran) */
  containerWidth: number;
  /** Wysokość widocznego obszaru */
  containerHeight: number;
  minScale?: number;
  maxScale?: number;
}

const ZoomablePanView: React.FC<ZoomablePanViewProps> = ({
  children,
  contentWidth,
  contentHeight,
  containerWidth,
  containerHeight,
  minScale = 1,
  maxScale = 4,
}) => {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  // Punkt od którego skalujemy (focal point pincha)
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);
  const focalAdjX = useSharedValue(0);
  const focalAdjY = useSharedValue(0);

  /** Oblicza maksymalne dopuszczalne przesunięcie dla danego scale */
  function maxOffset(containerSize: number, contentSize: number, s: number) {
    "worklet";
    const scaledSize = contentSize * s;
    // Jeśli plansza mniejsza niż kontener – wyśrodkuj, nie pozwól przesuwać
    if (scaledSize <= containerSize) return 0;
    return (scaledSize - containerSize) / 2;
  }

  function clamp(value: number, min: number, max: number) {
    "worklet";
    return Math.min(Math.max(value, min), max);
  }

  const pinchGesture = Gesture.Pinch()
    .onStart((e) => {
      focalX.value = e.focalX;
      focalY.value = e.focalY;
      // Zapamiętaj ile trzeba będzie skompensować przesunięcie po zmianie scale
      // tak żeby punkt pod palcami pozostał w miejscu
      focalAdjX.value =
        savedTranslateX.value - (focalX.value - containerWidth / 2);
      focalAdjY.value =
        savedTranslateY.value - (focalY.value - containerHeight / 2);
    })
    .onUpdate((e) => {
      const newScale = clamp(savedScale.value * e.scale, minScale, maxScale);
      scale.value = newScale;

      // Przesuń tak żeby focal point "stał w miejscu"
      const newTx = focalAdjX.value + (focalX.value - containerWidth / 2);
      const newTy = focalAdjY.value + (focalY.value - containerHeight / 2);

      const maxX = maxOffset(containerWidth, contentWidth, newScale);
      const maxY = maxOffset(containerHeight, contentHeight, newScale);
      translateX.value = clamp(newTx, -maxX, maxX);
      translateY.value = clamp(newTy, -maxY, maxY);
    })
    .onEnd(() => {
      savedScale.value = scale.value;
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      const maxX = maxOffset(containerWidth, contentWidth, scale.value);
      const maxY = maxOffset(containerHeight, contentHeight, scale.value);
      const newX = clamp(savedTranslateX.value + e.translationX, -maxX, maxX);
      const newY = clamp(savedTranslateY.value + e.translationY, -maxY, maxY);
      translateX.value = newX;
      translateY.value = newY;
    })
    .onEnd((e) => {
      // Zapisz aktualną pozycję jako bazę – nigdy nie wróci do poprzedniej
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;

      // Inercja z twardymi granicami
      const maxX = maxOffset(containerWidth, contentWidth, scale.value);
      const maxY = maxOffset(containerHeight, contentHeight, scale.value);
      translateX.value = withDecay(
        {
          velocity: e.velocityX,
          clamp: [-maxX, maxX],
          deceleration: 0.993,
          rubberBandEffect: false,
        },
        () => {
          savedTranslateX.value = translateX.value;
        },
      );
      translateY.value = withDecay(
        {
          velocity: e.velocityY,
          clamp: [-maxY, maxY],
          deceleration: 0.993,
          rubberBandEffect: false,
        },
        () => {
          savedTranslateY.value = translateY.value;
        },
      );
    });

  // Podwójne tapnięcie – reset do skali 1
  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      scale.value = withTiming(1);
      savedScale.value = 1;
      translateX.value = withTiming(0);
      translateY.value = withTiming(0);
      savedTranslateX.value = 0;
      savedTranslateY.value = 0;
    });

  // Pinch i pan działają jednocześnie; doubleTap ma pierwszeństwo przed pojedynczym tapem
  const composedGesture = Gesture.Simultaneous(
    Gesture.Exclusive(doubleTap),
    Gesture.Simultaneous(pinchGesture, panGesture),
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View
        style={[
          styles.container,
          { width: containerWidth, height: containerHeight },
        ]}
      >
        <Animated.View style={[styles.content, animatedStyle]}>
          {children}
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

export default ZoomablePanView;

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
});
