import React, { FC, ReactNode } from "react";
import { Animated, TouchableOpacity, ViewStyle } from "react-native";

interface ScalePressProps {
  onPress?: () => void;
  onLongPress?: () => void;
  children: ReactNode;
  style?: ViewStyle | ViewStyle[]; 
}

const ScalePress: FC<ScalePressProps> = ({
  onPress,
  onLongPress,
  children,
  style,
}) => {
//   const scaleValue = useRef(new Animated.Value(1)).current;
  const scaleValue = new Animated.Value(1);

  const onPressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      activeOpacity={1}
      style={{...style}}
    >
      <Animated.View
        style={{
          transform: [{ scale: scaleValue }],
          width: "100%",
        }}
      >
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default ScalePress;
