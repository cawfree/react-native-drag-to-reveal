import React, { useCallback, useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Platform,
  Animated,
  StyleSheet,
  ViewStyle,
  PanResponder,
} from "react-native";

export type DragToRevealProps = {
  readonly style: ViewStyle;
  readonly radius: number;
  readonly origin: {
    readonly x: number;
    readonly y: number;
  };
  readonly children: JSX.Element;
  readonly value: boolean;
  readonly onChange: (value: boolean) => void;
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
  value,
  onChange,
}): JSX.Element {
  const [animDrag] = useState(() => new Animated.ValueXY({
    x: 0,
    y: 0,
  }));
  const [layout, setLayout] = useState(null);

  const shouldAnimateToValue = useCallback((open) => {
    const toValue = open ? 400 : 0;
    animDrag.flattenOffset();
    Animated.timing(animDrag, {
      toValue: {
        x: toValue,
        y: toValue,
      },
      duration: 300,
    }).start();
  } , [animDrag]);


  useEffect(() => {
    shouldAnimateToValue(!!value);
  }, [value]);

  // TODO: Probably also dependent upon open state.
  const shouldBeOpen = useCallback(() => {
    return !!layout && (() => {
      // TODO: Here is where things are sketchy. Basically need to flip the logic.
      const { width, height } = layout;
      const { x, y } = animDrag.__getValue();
      const res = Math.min(x, y) > radius;
      //const res = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) > radius * 2;
      console.log({ x, y, res });
      return res;
    })();
  }, [animDrag, layout, radius]);

  const onRelease = useCallback(({ nativeEvent: { pageX, pageY } }) => {
    const shouldOpen = shouldBeOpen();
    if (shouldOpen !== value) {
      return onChange(shouldOpen);
    }
    // XXX: Just persist the animation.
    return shouldAnimateToValue(shouldOpen);
  }, [animDrag, layout, onChange, shouldBeOpen, value, shouldAnimateToValue]);

  const onLayout = useCallback(
    ({ nativeEvent: { layout } }) => setLayout(layout),
    [setLayout]
  );

  // XXX: This is certainly not a square root. :)
  const animDistance = Animated.add(
    Animated.multiply(animDrag.x, 2),
    Animated.multiply(animDrag.y, 2),
  );

  const clampedDistance = Animated.diffClamp(animDistance, radius, 10000);
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
            //animDrag.setOffset({ x: value ? 400 : 0, y: value ? 400 : 0 });
            
            //animDrag.flattenOffset();
            //animDrag.extractOffset();
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
  value: PropTypes.bool,
  onChange: PropTypes.func,
};

DragToReveal.defaultProps = {
  style: {},
  radius: 50,
  origin: { x: 0, y: 0 },
  value: false,
  onChange: () => null,
};

export default DragToReveal;
