import React from "react";
import { View } from "react-native";
import { useStyles } from "react-native-unistyles";
import LottieView from "lottie-react-native";
import { homeStyles } from "@/unistyles/homeStyles";

const Graphics = () => {
  const { styles } = useStyles(homeStyles);

  return (
    <View style={styles.lottieContainer} pointerEvents="none">
      <LottieView
        enableMergePathsAndroidForKitKatAndAbove
        enableSafeModeAndroid
        hardwareAccelerationAndroid
        source={require("@/assets/animations/event.json")}
        autoPlay
        loop
        style={styles.lottie}
      />
    </View>
  );
};

export default Graphics;
