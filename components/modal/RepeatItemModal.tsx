import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { FC, useEffect } from 'react'
import { useAppSelector } from '@/states/reduxHook'
import { selectRestaurantCartItem } from '@/states/reducers/cartSlice'
import { useStyles } from 'react-native-unistyles'
import { modelStyles } from '@/unistyles/modelStyles'
import CustomText from '../global/CustomText'
import { Colors } from '@/unistyles/Constants'
import MiniFoodCard from '../restaurant/MiniFoodCard'

interface RepeatItemModalProps {
    item: any,
    restaurant: any,
    onOpenAddModal: () => void,
    closeModal: () => void,
}

const RepeatItemModal:FC<RepeatItemModalProps> = ({item,restaurant,onOpenAddModal,closeModal}) => {
    const cartItem = useAppSelector(
        selectRestaurantCartItem(restaurant?.id, item?.id)
    );
    const {styles} = useStyles(modelStyles);

    useEffect(() => {
        if(!cartItem){
            closeModal();
        }
    }, [cartItem]);

    return (
      <View>
        <View style={styles.noShadowHeaderContainer}>
          <View style={styles.flexRowGap}>
            {/* Tiêu đề hỏi người dùng có muốn lặp lại tuỳ chỉnh trước đó không */}
            <CustomText fontFamily="Okra-Bold" fontSize={13}>
              Repeat last used customization?
            </CustomText>
          </View>
        </View>

        {/* Nội dung chính cuộn được, nền trắng */}
        <ScrollView
          contentContainerStyle={styles.scrollContainerWhiteBackground}
        >
          {cartItem?.customizations?.map((cus, index) => {
            return (
              <MiniFoodCard
                item={item}
                cus={cus}
                key={index}
                restaurant={restaurant}
              />
            );
          })}
        </ScrollView>

        {/* Footer */}
        <View style={styles.noShadowFooterContainer}>
          {/* Nút thêm mới tuỳ chỉnh */}
          <TouchableOpacity onPress={onOpenAddModal}>
            <CustomText
              fontFamily="Okra-Bold"
              color={Colors.active}
              fontSize={11}
            >
              + Add new customisation
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    );
}

export default RepeatItemModal