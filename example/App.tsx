import React, { useCallback, useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animation from "react-native-lottie";
import { useWindowDimensions } from "react-native-use-dimensions";

import { DragToReveal } from "./lib";

import Desk from "./assets/desk.json";
import Office from "./assets/office.json";

export default function App() {
  const { width, height } = useWindowDimensions();
  const [open, onChange] = useState<boolean>(true);
  const radius = 100;
  // origin is literally the starting position
  return (
    <View style={StyleSheet.absoluteFill}>
      <DragToReveal
        origin={{
          x: -radius,
          y: -radius + height,
        }}
        open={open}
        onChange={onChange}
        radius={radius}
        maxRadius={radius + 1000}
        renderChildren={() => (
          <View
            style={{
              flex: 1,
              backgroundColor: "orange",
            }}
          />
        )}
      />
    </View>
  );
}
