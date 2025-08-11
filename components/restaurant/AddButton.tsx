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

const AddButton: FC<{ item: any; restaurant: any }> = ({
  item,
  restaurant,
}) => {
  const { styles } = useStyles(foodStyles);
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
  }

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

    const addCartHandler = useCallback(() => {
      if (item?.isCustomizable) {
        if (cart !== null) {
          openRepeatModal();
          return;
        }
        openAddModal()
      } else {
        dispatch(
          addItemToCart({
            restaurant: restaurant,
            item: {
              ...item,
              customisations: [], // hoặc customizations tùy bạn đặt tên
            },
          })
        );
      }
    }, [dispatch, item, restaurant]);

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
        } else {
            dispatch(
            removeItemFromCart({
                restaurant_id: restaurant?.id,
                itemId: item?.id,
            })
            );
        }
    }, [dispatch, item, restaurant]);

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
