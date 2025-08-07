import React, { FC } from "react";
import { View, StyleSheet } from "react-native";
import CustomText from "../global/CustomText";
import Icon from "../global/Icon";

interface StarRatingProps {
  rating: number;
}

const getRatingColor = (rating: number): string => {
  if (rating >= 4) {
    return "#1C653C"; // Màu xanh đậm cho rating cao
  } else if (rating >= 3) {
    return "#128145"; // Màu xanh cho rating khá
  } else if (rating >= 2) {
    return "#e67e22"; // Màu cam cho rating trung bình
  } else if (rating >= 1) {
    return "#953925"; // Màu đỏ nâu cho rating thấp
  } else {
    return "#ccc"; // Màu xám nếu không có rating
  }
};

const StarRating: FC<StarRatingProps> = ({ rating }) => {
  const backgroundColor = getRatingColor(rating);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <CustomText color="#fff" fontSize={12} fontFamily="Okra-Bold">
        {rating || "-"}
      </CustomText>
      <Icon name="star" iconFamily="MaterialIcons" color="#fff" size={16} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    gap: 5,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default StarRating;
