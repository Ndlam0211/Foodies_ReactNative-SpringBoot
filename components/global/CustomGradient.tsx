import React, { FC } from "react";
import { ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface CustomGradientProps {
  position: "top" | "bottom";
  mode?: "dark" | "light";
  style?: ViewStyle;
}

const darkColors = [
  "rgba(0,0,0,0.9)",
  "rgba(0,0,0,0.6)",
  "rgba(0,0,0,0.1)",
  "rgba(0,0,0,0)",
];

const lightColors = [
  "rgba(255,255,255,1)",
  "rgba(255,255,255,0.9)",
  "rgba(255,255,255,0.1)",
];

const CustomGradient: FC<CustomGradientProps> = ({
  position = "top",
  mode = "dark",
  style,
}) => {
  const isTop = position === "top";
  const colors = mode === "dark" ? darkColors : lightColors;
  const gradientColors = isTop ? lightColors : [...colors].reverse();

  const gradientStyle: ViewStyle = {
    position: "absolute",
    width: "100%",
    height: 60,
    top: isTop ? 0 : undefined,
    bottom: !isTop ? 0 : undefined,
    zIndex: 1,
  };

  return (
    <LinearGradient
      colors={gradientColors as [string, string, ...string[]]}
      style={[gradientStyle, style]}
    />
  );
};

export default CustomGradient;
