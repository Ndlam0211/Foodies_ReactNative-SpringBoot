import { TouchableOpacity } from "react-native";
import React, { FC } from "react";
import Icon from "@/components/global/Icon";
import { RFValue } from "react-native-responsive-fontsize";
import CustomText from "@/components/global/CustomText";

const BackToTopButton: FC<{ onPress: () => void }> = ({ onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
    >
      <Icon
        name="arrow-up-circle-outline"
        iconFamily="Ionicons"
        color="#fff"
        size={RFValue(12)}
      />
      <CustomText variant="h6" style={{ color: "#fff" }} fontFamily="Okra-Bold">
        Back to top
      </CustomText>
    </TouchableOpacity>
  );
};

export default BackToTopButton;
