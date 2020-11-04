import React, { useEffect, useCallback, useState } from "react";
import PropTypes from "prop-types";
import {
  Animated,
  StyleSheet,
  ViewStyle,
  PanResponder,
  PixelRatio,
} from "react-native";

export type DragToRevealProps = {
  readonly style: ViewStyle;
  readonly radius: number;
  readonly maxRadius: number;
  readonly origin: {
    readonly x: number;
    readonly y: number;
  };
  readonly renderChildren: ({ open: boolean }) => JSX.Element;
  readonly open: boolean;
  readonly onChange: (open: boolean) => unknown;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red",
  },
});

const defaultDrag = Object.freeze({
  x: 0,
  y: 0,
});

function DragToReveal({
  style,
  origin,
  radius, // minimum radius
  maxRadius, // maximum radius
  renderChildren,
  open,
  onChange,
}: DragToRevealProps): JSX.Element {
  const [layout, setLayout] = useState(null);
  const animRadius = new Animated.Value(radius);
  const [animDrag] = useState(() => new Animated.ValueXY(defaultDrag));
  // TODO: init for open
  const [animExtraRadius] = useState(() => new Animated.Value(0));

  /* additional radius within bounds */
  const clampedExtraRadius = Animated.diffClamp(
    animExtraRadius,
    0,
    maxRadius - radius,
  );

  const currentRadius = Animated.add(animRadius, clampedExtraRadius);

  const shouldAnimate = useCallback((open) => {
    Animated.timing(animExtraRadius, {
      toValue: open ? maxRadius - radius : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [animExtraRadius]);

  useEffect(() => {
    shouldAnimate(open);
  }, [open, shouldAnimate]);

  const shouldBeOpen = useCallback(() => {
    const c = currentRadius.__getValue();
    const threshold = radius + (maxRadius - radius) * 0.5;
    return c > threshold;
  }, [currentRadius, maxRadius, radius]);

  const onRelease = useCallback(() => {
    const shouldOpen = shouldBeOpen();
    if (shouldOpen === open) {
      return shouldAnimate(open);
    }
    return onChange(shouldOpen);
  }, [animDrag, shouldBeOpen, shouldAnimate, open, onChange]);

  const onLayout = useCallback(({ nativeEvent: { layout } }) => {
    setLayout(layout);
  }, [setLayout]);

  // XXX: next, track the amount of drag
  return (
    <Animated.View
      style={[styles.container, StyleSheet.flatten(style)]}
      onLayout={onLayout}
    >
      {/* radius */}
      <Animated.View
        {...PanResponder.create({
          onStartShouldSetPanResponder: e => true,
          onPanResponderMove: (e, gesture) => {
            const { dy } = gesture;
            const ady = Math.abs(dy);
            const dyd = open ? -1 * ady : ady;
            animExtraRadius.setValue(
              Math.max(Math.min(maxRadius - radius, animExtraRadius.__getValue() + dyd / PixelRatio.get()), 0),
            );
            return Animated.event([null, {
              dx: animDrag.x,
              dy: animDrag.y,
            }], { useNativeDriver: false })(e, gesture);
          },
          onPanResponderRelease: onRelease,
          onPanResponderTerminate: onRelease,
        }).panHandlers}
        style={{
          transform: [
            { translateX: origin.x },
            { translateY: origin.y },
            { translateX: Animated.multiply(clampedExtraRadius, -1)},
            { translateY: Animated.multiply(clampedExtraRadius, -1)},
          ],
          width: Animated.multiply(currentRadius, 2),
          height: Animated.multiply(currentRadius, 2),
          borderRadius: currentRadius,
          overflow: "hidden",
        }}
      >
        <Animated.View
          style={{
            ...layout,
            transform: [
              { translateX: -1 * origin.x },
              { translateY: -1 * origin.y },
              { translateX: Animated.multiply(clampedExtraRadius, 1)},
              { translateY: Animated.multiply(clampedExtraRadius, 1)},
            ],
          }}
          children={renderChildren({ open: false })}
        />
      </Animated.View>
    </Animated.View>
  );
}

DragToReveal.propTypes = {
  style: PropTypes.any,
  radius: PropTypes.number,
  maxRadius: PropTypes.number,
  origin: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  renderChildren: PropTypes.func,
  open: PropTypes.bool,
  onChange: PropTypes.func,
};

DragToReveal.defaultProps = {
  style: {},
  radius: 55,
  maxRadius: 100,
  origin: { x: 0, y: 0 },
  renderChildren: ({ open }) => null,
  open: false,
  onChange: () => null,
};

export default DragToReveal;
