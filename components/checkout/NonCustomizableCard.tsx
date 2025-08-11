import { addItemToCart, removeItemFromCart } from "@/states/reducers/cartSlice";
import { useAppDispatch } from "@/states/reduxHook";
import { modelStyles } from "@/unistyles/modelStyles";
import React, { FC, memo, useCallback } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useStyles } from "react-native-unistyles";
import CustomText from "../global/CustomText";
import Icon from "../global/Icon";
import { Colors } from "@/unistyles/Constants";
import { RFValue } from "react-native-responsive-fontsize";
import AnimatedNumber from "react-native-animated-numbers";

interface NonCustomizableCardProps {
  item: any;
  restaurant: any;
}

const NonCustomizableCard: FC<NonCustomizableCardProps> = ({
  restaurant,
  item,
}) => {
  const dispatch = useAppDispatch();
  const {styles} = useStyles(modelStyles);

  const addCartHandler = useCallback(() => {
    dispatch(
      addItemToCart({
        restaurant,
        item: {
            ...item,
            customizations: []
        },
      })
    );
  }, [dispatch, restaurant?.id, item]);

  const removeCartHandler = useCallback(() => {
    dispatch(
      removeItemFromCart({
        restaurant_id: restaurant?.id,
        itemId: item?.id,
      })
    );
  }, [dispatch, restaurant?.id, item]);

  return (
    <View style={styles.flexRowItemBaseline}>
      <View style={styles.flexRowGapBaseline}>
        <Image
          style={styles.vegIcon}
          source={
            item?.isVeg
              ? require("@/assets/icons/veg.png")
              : require("@/assets/icons/non_veg.png")
          }
        />
        <View>
          <CustomText fontFamily="Okra-Bold">{item?.name}</CustomText>
          <CustomText fontFamily="Okra-Medium">${item?.price}</CustomText>
        </View>
      </View>

      <View style={styles.cartOperationContainer}>
        <View style={styles.miniAddButtonContainer}>
          <TouchableOpacity onPress={removeCartHandler}>
            <Icon
              iconFamily="MaterialCommunityIcons"
              color={Colors.active}
              name="minus-thick"
              size={RFValue(10)}
            />
          </TouchableOpacity>

          <AnimatedNumber
            includeComma={false}
            animationDuration={300}
            animateToNumber={item?.quantity}
            fontStyle={styles.miniAnimatedCount}
          />

          <TouchableOpacity onPress={addCartHandler}>
            <Icon
              iconFamily="MaterialCommunityIcons"
              color={Colors.active}
              name="plus-thick"
              size={RFValue(10)}
            />
          </TouchableOpacity>
        </View>

        <CustomText fontFamily="Okra-Medium">${item?.cartPrice}</CustomText>
      </View>
    </View>
  );
};

export default memo(NonCustomizableCard);
