import React from 'react';
import { StyleSheet, View } from 'react-native';

import { DragToReveal } from "./lib";

export default function App() {
  return (
    <View style={StyleSheet.absoluteFill}>
      <DragToReveal
        radius={100}
        origin={{ x: 0, y: 0 }}
      >
        <View
          style={{
            borderWidth: 1,
            width: 200,
            height: 200,
            backgroundColor: "orange",
          }}
        />
      </DragToReveal>
    </View>
  );
}
