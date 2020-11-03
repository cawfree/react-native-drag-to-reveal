import React, { useCallback, useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Platform,
  Animated,
  StyleSheet,
  ViewStyle,
  PanResponder,
  Easing,
  EasingFunction,
} from "react-native";

export type DragToRevealProps = {
  readonly style: ViewStyle;
  readonly radius: number;
  readonly revealRadius: number;
  readonly origin: {
    readonly x: number;
    readonly y: number;
  };
  readonly value: boolean;
  readonly onChange: (value: boolean) => void;
  readonly duration: number;
  readonly minDuration: number;
  readonly useNativeDriver: number;
  readonly renderChildren: ({ open: boolean }) => JSX.Element;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noOverflow: { overflow: "hidden" },
});

function DragToReveal({
  style,
  radius,
  revealRadius,
  origin,
  value,
  onChange,
  duration: totalDuration,
  minDuration,
  useNativeDriver,
  renderChildren,
}): JSX.Element {
  const [animDrag] = useState(() => new Animated.ValueXY({
    x: 0,
    y: 0,
  }));
  const [layout, setLayout] = useState(null);
  const shouldAnimateToValue = useCallback((open) => {
    const toValue = open ? revealRadius : 0;
    const easing = open ? Easing.in : Easing.in;
    const target = open ? revealRadius : radius;
    const h = Math.sqrt(Math.pow(animDrag.x.__getValue(), 2) + Math.pow(animDrag.y.__getValue(), 2));
    const md = h * 0.5 / target;
    const delta = Math.abs(md);
    const duration = h > revealRadius ? totalDuration * 1.2 : totalDuration;
    animDrag.flattenOffset();
    Animated.parallel([
      Animated.timing(animDrag.x, { toValue, easing, duration, useNativeDriver }),
      Animated.timing(animDrag.y, { toValue, easing, duration, useNativeDriver }),
    ]).start();
  }, [
    animDrag,
    revealRadius,
    radius,
    totalDuration,
    minDuration,
    useNativeDriver,
  ]);

  useEffect(() => {
    shouldAnimateToValue(!!value);
  }, [value]);

  const shouldBeOpen = useCallback(() => {
    return !!layout && (() => {
      const { width, height } = layout;
      const { x, y } = animDrag.__getValue();
      const abs = Math.min(x, y);
      return open ? abs > radius : abs < radius;
    })();
  }, [animDrag, layout, radius, open]);

  const onRelease = useCallback(({ nativeEvent: { pageX, pageY } }) => {
    const shouldOpen = shouldBeOpen();
    if (shouldOpen !== value) {
      return onChange(shouldOpen);
    }
    return shouldAnimateToValue(shouldOpen);
  }, [animDrag, layout, onChange, shouldBeOpen, value, shouldAnimateToValue]);

  const onLayout = useCallback(
    ({ nativeEvent: { layout } }) => setLayout(layout),
    [setLayout]
  );

  // XXX: This is certainly not a square root. :)
  const animDistance = Animated.add(
    Animated.multiply(animDrag.x, 2.8),
    Animated.multiply(animDrag.y, 2.8),
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
        {...PanResponder.create({
          onStartShouldSetPanResponder: e => {
            animDrag.extractOffset();
            return true;
          },
          onPanResponderMove: (e, gesture) => {
            const { x, y } = animDrag.__getValue();
            return Animated.event([null, {
              dx: animDrag.x,
              dy: animDrag.y,
            }])(e, gesture);
          },
          onPanResponderRelease: onRelease,
          onPanResponderTerminate: onRelease,
        }).panHandlers}
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
          >
            {renderChildren({ open: value })}
          </Animated.View>
        )}
      </Animated.View>
    </Animated.View>
  );
}

DragToReveal.propTypes = {
  style: PropTypes.any,
  radius: PropTypes.number,
  revealRadius: PropTypes.number,
  origin: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  value: PropTypes.bool,
  onChange: PropTypes.func,
  duration: PropTypes.number,
  minDuration: PropTypes.number,
  useNativeDriver: PropTypes.bool,
  renderChildren: PropTypes.func,
};

DragToReveal.defaultProps = {
  style: {},
  radius: 50,
  revealRadius: 500,
  origin: { x: 0, y: 0 },
  value: false,
  onChange: () => null,
  duration: 200,
  minDuration: 120,
  useNativeDriver: Platform.OS !== "web",
  renderChildren: () => null,
};

export default DragToReveal;
