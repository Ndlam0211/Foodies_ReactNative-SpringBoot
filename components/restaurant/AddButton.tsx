import { FC, memo, useCallback, useRef } from "react";
import { View, TouchableOpacity } from "react-native";
import CustomText from "@/components/global/CustomText";
import { useStyles } from "react-native-unistyles";
import { Colors } from "@/unistyles/Constants";
import { foodStyles } from "@/unistyles/foodStyles";
import ScalePress from "../ui/ScalePress";
import Icon from "../global/Icon";
import AnimatedNumbers from 'react-native-animated-numbers';
import { RFValue } from "react-native-responsive-fontsize";
import { useAppDispatch, useAppSelector } from "@/states/reduxHook";
import { addItemToCart, removeCustomizableItem, removeItemFromCart, selectRestaurantCartItem } from "@/states/reducers/cartSlice";
import CustomModal from "../modal/CustomModal";
import AddItemModal from "../modal/AddItemModal";
import RepeatItemModal from "../modal/RepeatItemModal";
import RemoveItemModal from "../modal/RemoveItemModal";
import {useMessage} from "@/hooks/useMessage";
import { crudService } from "@/api/apiService";

const AddButton: FC<{ item: any; restaurant: any }> = ({
  item,
  restaurant,
}) => {
    const { styles } = useStyles(foodStyles);
    const { showSuccess } = useMessage();
    const dispatch = useAppDispatch();
    const modalRef = useRef<any>(null);
    const cart = useAppSelector(selectRestaurantCartItem(restaurant?.id, item?.id));

    const openAddModal = () => {
      modalRef?.current?.openModal(
        <AddItemModal
          item={item}
          restaurant={restaurant}
          onClose={() => modalRef.current?.closeModal()}
        />
      )
    };

    const openRepeatModal = () => {
      modalRef?.current?.openModal(
        <RepeatItemModal
          item={item}
          restaurant={restaurant}
          onOpenAddModal={openAddModal}
          closeModal={() => modalRef.current?.closeModal()}
        />
      );
    };

    const openRemoveModal = () => {
      modalRef?.current?.openModal(
        <RemoveItemModal
          item={item}
          restaurant={restaurant}
          closeModal={() => modalRef.current?.closeModal()}
        />
      );
    };

    const addItemToCartWithSync = () => async (dispatch:any) => {
      await crudService.create("cart/add-item", {
          restaurantId: restaurant.id,
          menuItemId: item.id,
          quantity: 1,
        })
        .then(() => {
          dispatch(
            addItemToCart({
              restaurant: restaurant,
              item: {
                ...item,
                customisations: [], // item không có customization nên để mảng trống
              },
            })
          );
          showSuccess(`${item.name} added to cart successfully!`);
        })
        .catch((error) => {
          console.error("Error syncing cart with backend:", error);
        });
    };

    const removeItemToCartWithSync = () => async (dispatch:any) => {
      await crudService.create("cart/remove-item", {
          restaurantId: restaurant.id,
          menuItemId: item.id,
        })
        .then(() => {
          dispatch(
            removeItemFromCart({
              restaurant_id: restaurant?.id,
              itemId: item?.id,
            })
          );
          showSuccess(`${item.name} removed from cart successfully!`);
        })
        .catch((error) => {
          console.error("Error syncing cart with backend:", error);
        });
    };

    const addCartHandler = useCallback(() => {
      if (item?.isCustomizable) {
        if (cart !== null) {
          openRepeatModal();
          return;
        }
        openAddModal();
      } else {
        dispatch(addItemToCartWithSync());
      }
    }, [dispatch, item, restaurant, cart]);

    const removeCartHandler = useCallback(() => {
        if (item?.isCustomizable) {
          if (cart?.customizations && cart?.customizations.length > 1) {
            openRemoveModal();
            return;
          }
          dispatch(
            removeCustomizableItem({
              restaurant_id: restaurant?.id,
              customizationId: cart?.customizations![0]?.id,
              itemId: item?.id,
            })
          );
          showSuccess(`${item.name} removed from cart successfully!`);
        } else {
          dispatch(removeItemToCartWithSync());
        }
    }, [dispatch, item, restaurant, cart]);

  return (
    <>
      <CustomModal ref={modalRef} />
      <View style={styles.addButtonContainer(cart !== null)}>
        {cart ? (
          <View style={styles.selectedContainer}>
            <ScalePress onPress={removeCartHandler}>
              <Icon
                iconFamily="MaterialCommunityIcons"
                color="#fff"
                name="minus-thick"
                size={RFValue(13)}
              />
            </ScalePress>

            <AnimatedNumbers
              includeComma={false}
              animationDuration={300}
              animateToNumber={cart?.quantity || 0}
              fontStyle={styles.animatedCount}
            />

            <ScalePress onPress={addCartHandler}>
              <Icon
                iconFamily="MaterialCommunityIcons"
                color="#fff"
                name="plus-thick"
                size={RFValue(13)}
              />
            </ScalePress>
          </View>
        ) : (
          <TouchableOpacity
            onPress={addCartHandler}
            style={styles.noSelectionContainer}
            activeOpacity={0.6}
            accessibilityLabel="Add item to cart"
          >
            <CustomText
              fontFamily="Okra-Bold"
              variant="h5"
              color={Colors.primary}
            >
              ADD
            </CustomText>
            <CustomText
              variant="h5"
              color={Colors.primary}
              style={styles.plusSmallIcon}
            >
              +
            </CustomText>
          </TouchableOpacity>
        )}
      </View>

      {item?.isCustomizable && (
        <CustomText style={styles.customizeText} fontFamily="Okra-Medium">
          Customizable
        </CustomText>
      )}
    </>
  );
};

export default memo(AddButton);
