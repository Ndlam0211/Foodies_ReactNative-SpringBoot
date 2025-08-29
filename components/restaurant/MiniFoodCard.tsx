import { addCustomizableItem, removeCustomizableItem, selectRestaurantCartItem } from '@/states/reducers/cartSlice';
import { useAppDispatch, useAppSelector } from '@/states/reduxHook';
import { modelStyles } from '@/unistyles/modelStyles';
import React, { FC, memo, useRef } from 'react'
import { useStyles } from 'react-native-unistyles';
import EditItemModal from '../modal/EditItemModal';
import CustomModal from '../modal/CustomModal';
import { Image, TouchableOpacity, View } from 'react-native';
import CustomText from '../global/CustomText';
import Icon from '../global/Icon';
import { Colors } from '@/unistyles/Constants';
import { RFValue } from 'react-native-responsive-fontsize';
import AnimatedNumber from 'react-native-animated-numbers';
import { useMessage } from '@/hooks/useMessage';
import { crudService } from '@/api/apiService';

// Khai báo component MiniFoodCard dưới dạng Functional Component (FC) với các props:
// - item: món ăn
// - cus: thông tin tùy chỉnh (customization) của món ăn
// - restaurant: thông tin nhà hàng
const MiniFoodCard: FC<{
  item: any;
  cus: any;
  restaurant: any;
}> = ({ cus, restaurant, item }) => {
  const { showSuccess, showError } = useMessage();
  // Lấy styles từ hook useStyles với tham số modelStyles
  const { styles } = useStyles(modelStyles);

  // Lấy hàm dispatch từ Redux store để gửi action
  const dispatch = useAppDispatch();

  // Lấy thông tin cartItem từ Redux store dựa trên restaurant.id và item.id
  const cartItem = useAppSelector(
    selectRestaurantCartItem(restaurant?.id, item?.id)
  );

  // Tạo một ref để tham chiếu tới modal, giúp mở/đóng modal từ component
  const modalRef = useRef<any>(null);

  // Hàm mở modal chỉnh sửa món ăn
  const openEditModal = () => {
    modalRef?.current?.openModal(
      <EditItemModal
        item={item} // Món ăn được chỉnh sửa
        cus={cus} // Dữ liệu tùy chỉnh hiện tại
        restaurant={restaurant} // Thông tin nhà hàng
        onClose={() => modalRef?.current?.closeModal()} // Đóng modal khi hoàn tất
      />
    );
  };

  // Hàm thêm món ăn tuỳ chỉnh vào giỏ hàng
  const addCartHandler = async (cus: any) => {
    // Tạo dữ liệu món ăn kèm thông tin tuỳ chỉnh
    const data = {
      restaurant: restaurant, // Thông tin nhà hàng
      item: item, // Thông tin món ăn
      customization: {
        quantity: 1, // Số lượng mặc định là 1 khi thêm
        price: cus?.price, // Giá món ăn dựa vào đối tượng 'cus'
        customizationOptions: cus?.customizationOptions, // Các tuỳ chọn tuỳ chỉnh
      }, 
    };

    await crudService.create("cart/add-customizable-item", {
          restaurantId: restaurant.id,
          menuItemId: item.id,
          quantity: 1,
          price: cus?.price,
          customizationOptions: [
            {
              groupType: cus?.customizationOptions[0]?.type,
              optionName: cus?.customizationOptions[0]?.selectedOption?.name,
              optionPrice: cus?.customizationOptions[0]?.selectedOption?.price,
              required: cus?.customizationOptions[0]?.required,
            },
          ],
        })
        .then((response) => {
          // 4️⃣ Gửi action lên Redux để thêm món vào giỏ hàng
          dispatch(addCustomizableItem(data));
        })
        .catch((error) => {
          console.error("Error adding item to cart:", error);
          showError("Failed to add item to cart.");
        });
  };

  // Hàm xoá món ăn tuỳ chỉnh khỏi giỏ hàng
  const removeCartHandler = async (cus: any) => {
    await crudService.create("cart/remove-customizable-item", {
      restaurantId: restaurant.id,
      menuItemId: item.id,
      customizationId: cus.id,
    })
      .then((response) => {
        dispatch(removeCustomizableItem({
          restaurant_id: restaurant?.id, // ID nhà hàng
          customizationId: cus?.id, // ID tuỳ chỉnh
          itemId: item?.id, // ID món ăn
        }));
      })
      .catch((error) => {
        console.error("Error removing item from cart:", error);
        showError("Failed to remove item from cart.");
      });
  };

  return (
    <>
      <CustomModal ref={modalRef} />
      <View style={styles.flexRowItemBaseline}>
        <View style={styles.flexRowGapBaseline}>
          <Image
            style={styles.vegIcon}
            source={
              cartItem?.isVeg
                ? require("@/assets/icons/veg.png")
                : require("@/assets/icons/non_veg.png")
            }
          />

          <View>
            <CustomText fontFamily="Okra-Bold">{cartItem?.name}</CustomText>
            <CustomText fontFamily="Okra-Medium">${cus?.price}</CustomText>
            {/* Hiển thị các tùy chọn đã chọn */}
            <CustomText style={styles.selectedOptions}>
              {cus?.customizationOptions?.map((i: any, index: number) => {
                return (
                  <CustomText key={index} fontFamily="Okra-Medium" fontSize={9}>
                    {i?.selectedOption?.name},
                  </CustomText>
                );
              })}
            </CustomText>

            {/* Nút Edit */}
            <TouchableOpacity style={styles.flexRow} onPress={openEditModal}>
              <CustomText fontFamily="Okra-Medium" color="#444" fontSize={9}>
                Edit
              </CustomText>
              <View style={{ bottom: -1 }}>
                <Icon
                  name="arrow-right"
                  iconFamily="MaterialIcons"
                  color="#888"
                  size={16}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.cartOperationContainer}>
          <View style={styles.miniAddButtonContainer}>
            <TouchableOpacity onPress={() => removeCartHandler(cus)}>
              <Icon
                name="minus-thick"
                iconFamily="MaterialCommunityIcons"
                color={Colors.active}
                size={RFValue(10)}
              />
            </TouchableOpacity>

            <AnimatedNumber
              includeComma={false}
              animationDuration={300}
              fontStyle={styles.miniAnimatedCount}
              animateToNumber={cus?.quantity}
            />

            <TouchableOpacity onPress={() => addCartHandler(cus)}>
              <Icon
                name="plus-thick"
                iconFamily="MaterialCommunityIcons"
                color={Colors.active}
                size={RFValue(10)}
              />
            </TouchableOpacity>
          </View>

          <CustomText fontFamily='Okra-Medium'>${cus.cartPrice}</CustomText>
        </View>
      </View>
    </>
  );
};


export default memo(MiniFoodCard)