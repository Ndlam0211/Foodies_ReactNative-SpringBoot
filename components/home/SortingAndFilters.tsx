import React, { FC } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { useStyles } from "react-native-unistyles";
import { filterStyles } from "@/unistyles/filterStyles";
import Icon from "@/components/global/Icon";
import { Colors } from "@/unistyles/Constants";
import CustomText from "@/components/global/CustomText";

interface SortingAndFiltersProps {
  menuTitle: string;
  options: Record<string, any>;
}

const SortingAndFilters: FC<SortingAndFiltersProps> = ({
  menuTitle,
  options,
}) => {
  const { styles } = useStyles(filterStyles);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filterBar}
    >
      <TouchableOpacity style={styles.filterItem}>
        <View style={{ transform: [{ rotate: "90deg" }] }}>
          <Icon
            name="tune-vertical-variant"
            iconFamily="MaterialCommunityIcons"
            size={16}
            color={Colors.text}
          />
        </View>
        <CustomText fontSize={11} fontFamily="Okra-Medium">
          {menuTitle}
        </CustomText>
        <Icon
          name="caret-down"
          iconFamily="Ionicons"
          size={16}
          color={Colors.text}
        />
      </TouchableOpacity>

      {options?.map((i:string, index:number) => {
        return (
            <TouchableOpacity key={index} style={styles.filterItem}>
                <CustomText fontFamily="Okra-Medium" fontSize={11}>{i}</CustomText>
            </TouchableOpacity>
        )
      })}

    </ScrollView>
  );
};

export default SortingAndFilters;
