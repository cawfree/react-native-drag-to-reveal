import React, { useCallback, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Animated, StyleSheet, ViewStyle, PanResponder } from "react-native";

export type DragToRevealProps = {
  readonly style: ViewStyle;
  readonly radius: number;
  readonly origin: {
    readonly x: number;
    readonly y: number;
  };
  readonly children: JSX.Element;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "green",
  },
  noOverflow: { overflow: "hidden" },
});

function DragToReveal({
  style,
  radius,
  origin,
  children,
}): JSX.Element {
  const [animDrag] = useState(() => new Animated.ValueXY({
    x: 0,
    y: 0,
  }));
  const [layout, setLayout] = useState(null);
  const onRelease = useCallback(() => {
    animDrag.extractOffset();
  }, [animDrag]);
  const [panResponder] = useState(() => PanResponder.create({
    onStartShouldSetPanResponder: e => true,
    onPanResponderMove: (e, gesture) => {
      const { x, y } = animDrag.__getValue();
      return Animated.event([null, {
        dx: animDrag.x,
        dy: animDrag.y,
      }])(e, gesture);
    },
    onPanResponderRelease: onRelease,
    onPanResponderTerminate: onRelease,
  }));
  const onLayout = useCallback(
    ({ nativeEvent: { layout } }) => setLayout(layout),
    [setLayout]
  );

  // XXX: This is certainly not a square root. :)
  const animDistance = Animated.add(
    Animated.multiply(animDrag.x, 2),
    Animated.multiply(animDrag.y, 2),
  );

  const clampedDistance = Animated.diffClamp(animDistance, radius, Number.MAX_SAFE_INTEGER);

  const rootRadius = Animated.add(clampedDistance, radius);
  const renderRadius = Animated.add(clampedDistance, radius * 2);
  const animOffset = Animated.multiply(renderRadius, -0.5);
  return (
    <Animated.View
      style={[
        styles.container,
        StyleSheet.flatten(style),
      ]}
      onLayout={onLayout}
    >
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.noOverflow,
          {
            transform: [
              { translateX: Animated.add(animOffset, origin.x) },
              { translateY: Animated.add(animOffset, origin.y) },
            ],
          },
          {
            width: renderRadius,
            height: renderRadius,
            borderRadius: rootRadius,
          },
          { backgroundColor: "red" },
        ]}
      >
        {!!layout && (
          <Animated.View
            style={{
              ...layout,
              transform: [
                { translateX: Animated.multiply(animOffset, -1) },
                { translateY: Animated.multiply(animOffset, -1) },
                { translateX: -origin.x },
                { translateY: -origin.y },
              ],
            }}
            children={children}
          />
        )}
      </Animated.View>
    </Animated.View>
  );
}

DragToReveal.propTypes = {
  style: PropTypes.any,
  radius: PropTypes.number,
  origin: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
};

DragToReveal.defaultProps = {
  style: {},
  radius: 50,
  origin: { x: 0, y: 0 },
};

export default DragToReveal;
