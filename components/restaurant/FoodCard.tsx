import { FC, memo } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { useStyles } from "react-native-unistyles";
import CustomText from "@/components/global/CustomText";
import Icon from "@/components/global/Icon";
import { foodStyles } from "@/unistyles/foodStyles";
import { Colors } from "@/unistyles/Constants";
import AddButton from "./AddButton";

const FoodCard: FC<{ item: any; restaurant: any }> = ({ item, restaurant }) => {
  const { styles } = useStyles(foodStyles);

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        {/* Icon Veg / Non-Veg */}
        <Image
          source={
            item?.isVeg
              ? require("@/assets/icons/veg.png")
              : require("@/assets/icons/non_veg.png")
          }
          style={styles.vegIcon}
        />

        {/* Tên món ăn */}
        <CustomText fontSize={12} numberOfLines={1} fontFamily="Okra-Medium">
          {item?.name}
        </CustomText>

        {/* Mô tả món ăn */}
        <CustomText
          fontSize={10}
          numberOfLines={2}
          style={styles.lowOpacity}
          fontFamily="Okra-Medium"
        >
          {item?.description}
        </CustomText>

        {/* Giá món ăn */}
        <CustomText fontSize={11} numberOfLines={1} fontFamily="Okra-Medium">
          ${item?.price}
        </CustomText>

        {/* Nút thêm vào bộ sưu tập */}
        <TouchableOpacity style={styles.addToCollectionContainer}>
          <Icon
            name="bookmark-outline"
            iconFamily="Ionicons"
            size={16}
            color={Colors.primary}
          />
          <CustomText color="#888" fontFamily="Okra-Medium" fontSize={9.5}>
            Add to Collection
          </CustomText>
        </TouchableOpacity>
      </View>

      <View style={styles.imageContainer}>
        <View style={styles.image}>
          <Image source={{uri: item?.image}} style={styles.foodImage} />
          <AddButton item={item} restaurant={restaurant} />
        </View>
      </View>
    </View>
  );
};

export default memo(FoodCard);
