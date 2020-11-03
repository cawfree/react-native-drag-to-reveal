import React, { useCallback, useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animation from "react-native-lottie";
import { useWindowDimensions } from "react-native-use-dimensions";

import { DragToReveal } from "./lib";

import Desk from "./assets/desk.json";
import Office from "./assets/office.json";

export default function App() {
  const { width, height } = useWindowDimensions();
  const [value, onChange] = useState<boolean>(false);
  const [absoluteFill] = useState<ViewStyle>(() => ({
    height,
    overflow: "hidden",
    position: "absolute",
    width,
  }));
  const renderChildren = useCallback(({ open }) => (
    <View
      style={{
        ...absoluteFill,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#508AA3",
      }}
    >
      <Animation
        style={absoluteFill}
        source={Desk}
        autoPlay
        loop
      />
    </View>
  ), []);
  return (
    <View style={absoluteFill}>
      <Animation
        style={absoluteFill}
        source={Office}
        autoPlay
        loop
      />
      <DragToReveal
        style={absoluteFill}
        radius={100}
        value={value}
        onChange={onChange}
        origin={{ x: width, y: 0 }}
        renderChildren={renderChildren}
      />
    </View>
  );
}
