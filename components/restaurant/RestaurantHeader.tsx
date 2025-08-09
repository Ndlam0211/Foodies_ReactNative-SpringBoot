import React, { FC } from "react";
import { View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useStyles } from "react-native-unistyles";
import { restaurantHeaderStyles } from "@/unistyles/restuarantStyles";
import Icon from "../global/Icon";
import CustomText from "../global/CustomText";
import { goBack } from "@/utils/NavigationUtils";

const RestaurantHeader: FC<{ title: string }> = ({ title }) => {
  const {styles} = useStyles(restaurantHeaderStyles);

  return (
    <View style={styles.headerContainer}>
      <View style={styles.flexRowGap}>
        <TouchableOpacity onPress={() => goBack()}>
          <Icon
            name="arrow-left"
            iconFamily="MaterialCommunityIcons"
            size={24}
          />
        </TouchableOpacity>

        <View>
          <CustomText
            fontFamily="Okra-Medium"
            fontSize={9.5}
            style={styles.title}
          >
            {title}
          </CustomText>
          <CustomText fontFamily="Okra-Bold" fontSize={11}>
            Recommended for you
          </CustomText>
        </View>
      </View>

      <TouchableOpacity onPress={() => {}}>
        <Icon name="ellipsis-vertical-sharp" iconFamily="Ionicons" size={24} />
      </TouchableOpacity>
    </View>
  );
};

export default RestaurantHeader;
