import CustomText from "@/components/global/CustomText";
import Icon from "@/components/global/Icon";
import { useMessage } from "@/hooks/useMessage";
import { clearRestaurantCart } from "@/states/reducers/cartSlice";
import { useAppDispatch } from "@/states/reduxHook";
import { cartStyles } from "@/unistyles/cartStyles";
import { Colors } from "@/unistyles/Constants";
import { navigate } from "@/utils/NavigationUtils";
import React, { FC, useMemo } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useStyles } from "react-native-unistyles";

interface CartItemProps {
  item: any;
}

const CartItem: FC<CartItemProps> = ({ item }) => {
  const dispatch = useAppDispatch();
  const { showSuccess } = useMessage();
  const { styles } = useStyles(cartStyles);

  const deleteCart = async (id: any) => {
    dispatch(clearRestaurantCart({ restaurant_id: id }));
    showSuccess("Cart deleted successfully!");
  };

  const totalItems = useMemo(() => {
    if (!item || !Array.isArray(item.items)) {
      return 0;
    }
    return item.items.reduce((acc: number, cartItem: any) => {
      acc += cartItem.quantity || 0;
      return acc;
    }, 0);
  }, [item]);

  // Early return if item is null or undefined (after all hooks)
  if (!item || !item.restaurant || !Array.isArray(item.items)) {
    console.warn("CartItem: Invalid item data", item);
    return null;
  }

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
