import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animation from "react-native-lottie";
import { useWindowDimensions } from "react-native-use-dimensions";

import { DragToReveal } from "./lib";

import Desk from "./assets/desk.json";
import Office from "./assets/office.json";

export default function App() {
  const { width, height } = useWindowDimensions();
  const [value, onChange] = useState(false);
  const renderChildren = useCallback(({ open }) => (
    <View
      style={{
        width,
        height,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#508AA3",
      }}
    >
      <Animation
        style={{ width, height  }}
        source={Desk}
        autoPlay
        loop
      />
    </View>
  ), []);
  return (
    <View style={{ position: "absolute", width, height, overflow: "hidden" }}>
      <Animation
        style={{ position: "absolute", width, height  }}
        source={Office}
        autoPlay
        loop
      />
      <DragToReveal
        style={{ position: "absolute", width, height  }}
        radius={10}
        value={value}
        onChange={onChange}
        origin={{ x: 0, y: 0 }}
        renderChildren={renderChildren}
      />
    </View>
  );
}
