import { View, Text, Platform } from "react-native";
import React, { FC } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStyles } from "react-native-unistyles";
import Animated, { Extrapolate, interpolate, useAnimatedStyle } from "react-native-reanimated";
import { homeStyles } from "@/unistyles/homeStyles";
import { useSharedState } from "../tabs/SharedContext";
import Graphics from "@/components/home/Graphics";
import HeaderSection from "@/components/home/HeaderSection";
import { StatusBar } from "expo-status-bar";

const DeliveryScreen: FC = () => {
    const insets = useSafeAreaInsets();
    const { styles } = useStyles(homeStyles);
    const { scrollYGlobal } = useSharedState();

    const backgroundColorChanges = useAnimatedStyle(() => {
      const opacity = interpolate(scrollYGlobal.value, [1, 50], [0, 1]);
      return {
        backgroundColor: `rgba(255,255,255,${opacity})`,
      };
    });

    const moveUpStyle = useAnimatedStyle(() => {
      const translateY = interpolate(
        scrollYGlobal.value,
        [0, 50],
        [0, -50],
        Extrapolate.CLAMP // Không cho vượt quá giới hạn
      );
      return {
        transform: [{ translateY: translateY }],
      };
    });

    const moveUpStyleNotExtrapolate = useAnimatedStyle(() => {
      const translateY = interpolate(
        scrollYGlobal.value,
        [0, 50],
        [0, -50] // Mặc định là `Extrapolate.EXTEND`
      );
      return {
        transform: [{ translateY: translateY }],
      };
    });

    return (
      <View style={[styles.container]}>
        <StatusBar hidden={Platform.OS !== "android"} />
        
        <View style={{height:Platform.OS === 'ios' ? insets.top : 0}} />

        <Animated.View style={moveUpStyle}>
          <Animated.View style={moveUpStyleNotExtrapolate}>
            <Graphics />
          </Animated.View>

          <Animated.View style={[backgroundColorChanges, styles.topHeader]}>
            <HeaderSection />
          </Animated.View>
        </Animated.View>

        <Animated.View style={moveUpStyle}>
          
        </Animated.View>
      </View>
    );
};

export default DeliveryScreen;
