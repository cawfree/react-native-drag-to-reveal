import React from 'react';
import { StyleSheet, View } from 'react-native';

import { DragToReveal } from "./lib";

export default function App() {
  return (
    <View style={StyleSheet.absoluteFill}>
      <DragToReveal
        origin={{
          x: 100,
          y: 100,
        }}
      />
    </View>
  );
}
