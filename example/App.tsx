import React, { useCallback, useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, ViewStyle } from 'react-native';
import Animation from "react-native-lottie";
import { useWindowDimensions } from "react-native-use-dimensions";

import { DragToReveal } from "./lib";

import Desk from "./assets/desk.json";
import Office from "./assets/office.json";

export default function App() {
  const { width, height } = useWindowDimensions();
  const [open, onChange] = useState<boolean>(true);
  const radius = 100;
  return (
    <View style={StyleSheet.absoluteFill}>
      <Animation
        source={Desk}
        style={StyleSheet.absoluteFill}
        loop
        autoPlay
      />
      <DragToReveal
        origin={{
          x: -radius,
          y: -radius + height,
        }}
        disabled={open}
        open={open}
        onChange={onChange}
        radius={radius}
        maxRadius={radius + 1000}
        renderChildren={() => (
          <ScrollView
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: "purple" },
            ]}
          >
            <View
              style={{
                width,
                height,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <TouchableOpacity onPress={() => onChange(false)}>
                <Animation
                  style={{
                    width,
                    height: width,
                  }}
                  source={Office}
                  autoPlay
                  loop
                />
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      />
    </View>
  );
}
