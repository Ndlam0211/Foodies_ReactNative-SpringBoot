import React from "react";
import { View, StyleSheet } from "react-native";

const DOTTED_SEGMENTS = 1; // Số lượng nét đứt, tuỳ chỉnh theo độ rộng

const DottedLine = () => {
  return (
    <View style={styles.container}>
      {Array.from({ length: DOTTED_SEGMENTS }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index % 2 === 0 ? styles.dotVisible : styles.dotInvisible,
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    marginTop: 15,
    width: "100%",
  },
  dot: {
    height: 2,
    flex: 1, // Tự chia đều chiều rộng
  },
  dotVisible: {
    backgroundColor: "#eee",
  },
  dotInvisible: {
    backgroundColor: "transparent",
  },
});

export default DottedLine;
