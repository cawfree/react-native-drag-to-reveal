import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { DragToReveal } from "./lib";

export default function App() {
  const [value, onChange] = useState(false);
  return (
    <View style={StyleSheet.absoluteFill}>
      <DragToReveal
        radius={100}
        value={value}
        onChange={onChange}
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
