import React, { useCallback, useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  Animated,
  View,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import Animation from "react-native-lottie";
import { useWindowDimensions } from "react-native-use-dimensions";

import { DragToReveal } from "react-native-drag-to-reveal";

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
        renderChildren={({ open, progress }) => (
          <ScrollView
            pointerEvents={open ? "auto" : "none"}
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
                <Animated.View style={{ opacity: progress }}>
                  <Animation
                    style={{
                      width,
                      height: width,
                    }}
                    source={Office}
                    autoPlay
                    loop
                  />
                </Animated.View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      />
    </View>
  );
}
