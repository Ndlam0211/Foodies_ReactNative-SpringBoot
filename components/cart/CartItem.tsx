import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { FC, useMemo } from "react";
import { useAppDispatch } from "@/states/reduxHook";
import { useStyles } from "react-native-unistyles";
import { cartStyles } from "@/unistyles/cartStyles";
import { clearRestaurantCart } from "@/states/reducers/cartSlice";
import CustomText from "@/components/global/CustomText";
import { navigate } from "@/utils/NavigationUtils";
import Icon from "@/components/global/Icon";
import { Colors } from "@/unistyles/Constants";
import { RFValue } from "react-native-responsive-fontsize";

interface CartItemProps {
  item: any; 
}

const CartItem: FC<CartItemProps> = ({ item }) => {
  const dispatch = useAppDispatch();
  const { styles } = useStyles(cartStyles);

  const deleteCart = async (id: any) => {
    dispatch(clearRestaurantCart({ restaurant_id: id }));
  };

  const totalItems = useMemo(() => {
    return item.items.reduce((acc: number, item: any) => {
      acc += item.quantity;
      return acc;
    }, 0);
  }, [item.items]);

return (
  <View style={styles.cartItemContainer}>
    <View style={styles.flexRowGap}>
      {/* Restaurant Image */}
      <Image
        source={{ uri: item?.restaurant?.imageUrl }}
        style={styles.image}
      />

      {/* Restaurant Info */}
      <View>
        <CustomText fontFamily="Okra-Medium" fontSize={10}>
          {item?.restaurant?.name}
        </CustomText>

        <TouchableOpacity
          style={styles.flexRow}
          onPress={() =>
            navigate("RestaurantScreen", {
              item: item.restaurant,
            })
          }
        >
          <CustomText
            style={{ top: -1 }}
            fontSize={9}
            fontFamily="Okra-Medium"
            color={Colors.active}
          >
            View Menu
          </CustomText>

          <Icon
            name="chevron-right"
            iconFamily="MaterialIcons"
            color={Colors.active}
            size={12}
          />
        </TouchableOpacity>
      </View>
    </View>

    <View style={styles.flexRowGap}>
      {/* View Cart Button */}
      <TouchableOpacity
        style={styles.cartButton}
        onPress={() =>
          navigate("CheckoutScreen", {
            item: item?.restaurant,
          })
        }
      >
        <CustomText fontFamily="Okra-Bold" color="#fff" fontSize={10}>
          View Cart
        </CustomText>
        <CustomText fontFamily="Okra-Medium" color="#fff" fontSize={8}>
          {totalItems} item{totalItems !== 1 ? "s" : ""}
        </CustomText>
      </TouchableOpacity>

      {/* Close Button */}
      <TouchableOpacity
        onPress={() => deleteCart(item?.restaurant.id)}
        style={styles.closeButton}
      >
        <Icon
          name="close"
          iconFamily="MaterialCommunityIcons"
          size={RFValue(12)}
        />
      </TouchableOpacity>
    </View>
  </View>
);
};

export default CartItem;
