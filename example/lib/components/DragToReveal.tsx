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
      return true;
    },
    onPanResponderRelease: onRelease,
    onPanResponderTerminate: onRelease,
  }));
  const onLayout = useCallback(
    ({ nativeEvent: { layout } }) => setLayout(layout),
    [setLayout]
  );
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
              { translateX: Animated.add(animDrag.x, origin.x) },
              { translateY: Animated.add(animDrag.y, origin.y) },
            ],
          },
          {
            width: radius * 2,
            height: radius * 2,
            borderRadius: radius,
          },
          { backgroundColor: "red" },
        ]}
      >
        {!!layout && (
          <Animated.View
            style={{
              ...layout,
              transform: [
                { translateX: Animated.multiply(animDrag.x, -1) },
                { translateY: Animated.multiply(animDrag.y, -1) },
              ],
            }}
          >
            <Animated.View
              style={{
                width: 500,
                height: 500,
                backgroundColor: "purple",
              }}
            />
          </Animated.View>
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
