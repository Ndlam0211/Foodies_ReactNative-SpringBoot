import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import React, { FC, useEffect, useState } from "react";
import { useAppDispatch } from "@/states/reduxHook";
import { modelStyles } from "@/unistyles/modelStyles";
import { useStyles } from "react-native-unistyles";
import { addCustomizableItem } from "@/states/reducers/cartSlice";
import CustomText from "../global/CustomText";
import Icon from "../global/Icon";
import { Colors } from "@/unistyles/Constants";
import DottedLine from "../ui/DottedLine";
import ScalePress from "../ui/ScalePress";
import { RFValue } from "react-native-responsive-fontsize";
import AnimatedNumbers from 'react-native-animated-numbers'

interface AddItemModalProps {
  item: any;
  restaurant: any;
  onClose: () => void;
}

/**
 * Hàm chuyển đổi dữ liệu `selectedOption` từ dạng key-value 
 * sang mảng các đối tượng đầy đủ thông tin (type + selectedOption)
 *
 * @param selectedOption - Object chứa các tùy chọn đã được chọn, dạng { type: index }
 * @param customizationOptions - Mảng các nhóm tùy chọn có sẵn, mỗi nhóm chứa type và options[]
 * @returns Mảng các object đã được ánh xạ { type, selectedOption }
 */
function transformSelectedOptions(
  selectedOption: any,
  customizationOptions: any
) {
  // Duyệt qua từng cặp key-value trong selectedOption
  return Object.entries(selectedOption).map(([type, index]) => {
    
    // Tìm group tùy chọn trong customizationOptions có type trùng khớp
    const customization = customizationOptions?.find(
      (option: any) => option.type === type
    );

    // Nếu không tìm thấy group hoặc index nằm ngoài options => báo lỗi
    if (!customization || !customization?.options[index as number]) {
      throw new Error(
        `Invalid customization type or index for ${type}`
      );
    }

    // Trả về object chứa:
    // - type: loại tùy chọn
    // - selectedOption: tùy chọn cụ thể mà người dùng đã chọn
    return {
      type,
      selectedOption: customization?.options[index as number],
    };
  });
}


const AddItemModal: FC<AddItemModalProps> = ({ item, restaurant, onClose }) => {
  const dispatch = useAppDispatch();
  const { styles } = useStyles(modelStyles);

  const [data, setData] = useState({
    quantity: 1,
    price: item?.price,
    selectedOption: {} as Record<string, number>,
  });

  useEffect(() => {
    const defaultSelectedOption: Record<string, number> = {};
    let initialPrice = item?.price || 0;

    item?.customizationOptions?.forEach((customization: any) => {
      if (customization?.required) {
        // Tìm index của option mặc định (có thể là option đầu tiên hoặc có giá)
        const defaultOptionIndex = customization?.options?.findIndex(
          (option: any) => option?.price === 0
        );

        if (defaultOptionIndex !== -1) {
          defaultSelectedOption[customization.type] = defaultOptionIndex;
          initialPrice +=
            customization?.options[defaultOptionIndex]?.price || 0;
        }
      }
    });

    setData((prevData) => ({
      ...prevData,
      selectedOption: defaultSelectedOption,
      price: initialPrice,
    }));
  }, [item]);

  //   Lấy basePrice của món => Cộng thêm giá của các tùy chọn đã chọn (selectedOption) => Nhân với quantity
  const calculatePrice = (
    quantity: number,
    selectedOption: Record<string, number>
  ) => {
    const basePrice = item?.price || 0;
    let customizationPrice = 0;

    Object.keys(selectedOption).forEach((type) => {
      const optionIndex = selectedOption[type];
      const optionPrice =
        item?.customizationOptions?.find((c: any) => c.type === type)
          ?.options?.[optionIndex]?.price || 0;

      customizationPrice += optionPrice;
    });

    return (basePrice + customizationPrice) * quantity;
  };

  /**
   * Xử lý khi người dùng chọn một option (ví dụ: size, topping)
   * @param type  - Loại tùy chọn (ví dụ: 'size', 'topping')
   * @param index - Chỉ số của option được chọn trong mảng options
   */
  const selectOptionHandler = (type: string, index: number) => {
    setData((prevData) => {
      // 1. Sao chép lại đối tượng selectedOption cũ
      //    và cập nhật option mới được chọn cho loại 'type'
      const updatedSelectedOption = {
        ...prevData.selectedOption,
        [type]: index, // Ghi đè index của loại option này
      };

      // 2. Tính lại giá mới dựa trên số lượng và option đã chọn
      const updatedPrice = calculatePrice(
        prevData?.quantity, // Số lượng hiện tại
        updatedSelectedOption // Option đã cập nhật
      );

      // 3. Trả về state mới (React sẽ merge vào state cũ)
      return {
        ...prevData, // Giữ nguyên các dữ liệu khác
        selectedOption: updatedSelectedOption, // Gán option mới
        price: updatedPrice, // Gán giá mới tính được
      };
    });
  };

  /**
   * Hàm tăng số lượng sản phẩm trong giỏ hàng
   */
  const addCartHandler = () => {
    setData((prevData) => ({
      ...prevData, // Giữ nguyên dữ liệu cũ trong state
      quantity: prevData?.quantity + 1, // Tăng số lượng thêm 1
      // Tính lại giá mới dựa trên số lượng mới và tùy chọn hiện tại
      price: calculatePrice(prevData?.quantity + 1, prevData?.selectedOption),
    }));
  };

  /**
   * Hàm giảm số lượng sản phẩm trong giỏ hàng
   * Nếu số lượng > 1 thì giảm xuống
   * Nếu số lượng = 1 thì đóng modal/cart (onClose)
   */
  const removeCartHandler = () => {
    if (data?.quantity > 1) {
      // Giảm số lượng nếu vẫn > 1
      setData((prevData) => ({
        ...prevData, // Giữ nguyên dữ liệu cũ
        quantity: prevData?.quantity - 1, // Giảm số lượng đi 1
        // Tính lại giá mới dựa trên số lượng mới và tùy chọn hiện tại
        price: calculatePrice(prevData?.quantity - 1, prevData?.selectedOption),
      }));
    } else {
      // Nếu chỉ còn 1 sản phẩm thì đóng modal/cart
      onClose();
    }
  };

  // Hàm thêm món ăn đã được tuỳ chỉnh vào giỏ hàng
  const addItemIntoCart = async () => {
    // 1️⃣ Chuyển đổi `selectedOption` từ state hiện tại thành mảng các option chi tiết
    const customizationOptions = transformSelectedOptions(
      data?.selectedOption, // Lựa chọn hiện tại của người dùng (kiểu { loại: index })
      item?.customizationOptions // Danh sách tùy chọn có sẵn của món ăn
    )
      // 2️⃣ Sắp xếp các tùy chọn theo tên loại (để đảm bảo thứ tự cố định)
      .sort((a, b) => a.type.localeCompare(b.type));

    // 3️⃣ Tạo object chứa toàn bộ dữ liệu món ăn đã được tùy chỉnh
    const customizedData = {
      restaurant: restaurant, // Thông tin nhà hàng
      item: item, // Thông tin món ăn gốc
      customization: {
          quantity: data?.quantity, // Số lượng người dùng đã chọn
          price: data?.price, // Giá đã tính toán
          customizationOptions: customizationOptions, // Danh sách tùy chọn chi tiết
      }, // dùng để lưu logic tùy chỉnh nâng cao
    };

    // 4️⃣ Gửi action lên Redux để thêm món vào giỏ hàng
    dispatch(addCustomizableItem(customizedData));

    // 5️⃣ Đóng modal hoặc popup chọn món
    onClose();
  };

  return (
    <View>
      <View style={styles.headerContainer}>
        {/* Hàng ngang chứa hình ảnh và tên món */}
        <View style={styles.flexRowGap}>
          {/* Hiển thị ảnh món ăn */}
          <Image source={{ uri: item?.image }} style={styles.headerImage} />

          {/* Hiển thị tên món ăn */}
          <CustomText fontFamily="Okra-Medium" fontSize={12}>
            {item?.name}
          </CustomText>
        </View>

        {/* Hàng ngang chứa các icon chức năng */}
        <View style={styles.flexRowGap}>
          {/* Nút lưu món vào danh sách bookmark */}
          <TouchableOpacity style={styles.icon}>
            <Icon
              name="bookmark-outline" // Tên icon
              iconFamily="Ionicons" // Bộ icon Ionicons
              color={Colors.primary} // Màu chủ đạo
              size={16} // Kích thước icon
            />
          </TouchableOpacity>

          {/* Nút chia sẻ món */}
          <TouchableOpacity style={styles.icon}>
            <Icon
              name="share-outline"
              iconFamily="Ionicons"
              color={Colors.primary}
              size={16}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Lặp qua từng tuỳ chọn tuỳ biến (customizationOptions) */}
        {item?.customizationOptions?.map(
          (customization: any, index: number) => {
            return (
              <View style={styles.subContainer} key={index}>
                {/* Hiển thị tên loại tuỳ chọn (ví dụ: Size, Topping) */}
                <CustomText fontFamily="Okra-Medium">
                  {customization?.type}
                </CustomText>

                {/* Hiển thị thông tin yêu cầu: bắt buộc hay tùy chọn */}
                <CustomText fontFamily="Okra-Medium" variant="h7" color="#888">
                  {customization?.required
                    ? "Required - Select any 1 option"
                    : `Add on your ${customization?.type}`}
                </CustomText>

                {/* Đường kẻ chấm phân cách giữa các tuỳ chọn */}
                <DottedLine />

                {customization?.options?.map((option: any, i: number) => {
                  return (
                    <TouchableOpacity
                      key={i}
                      style={styles.optionContainer}
                      onPress={() => {
                        // Xử lý chọn option khi bấm: update state selectedOption
                        selectOptionHandler(customization?.type, i);
                      }}
                    >
                      {/* Tên option */}
                      <CustomText fontFamily="Okra-Medium" fontSize={11}>
                        {option?.name}
                      </CustomText>

                      {/* Giá + Icon chọn */}
                      <View style={styles.flexRowGap}>
                        <CustomText fontSize={11} fontFamily="Okra-Medium">
                          ${option?.price}
                        </CustomText>
                        <Icon
                          name={
                            data?.selectedOption[customization.type] === i
                              ? "radiobox-marked"
                              : "radiobox-blank"
                          }
                          iconFamily="MaterialCommunityIcons"
                          color={
                            data?.selectedOption[customization.type] === i
                              ? Colors.active
                              : "#888"
                          }
                          size={16}
                        />
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            );
          }
        )}
      </ScrollView>

      {/* // Footer chứa phần chọn số lượng và nút "Add to Cart" */}
      <View style={styles.footerContainer}>
        {/* Container chứa nút trừ, số lượng và nút cộng */}
        <View style={styles.selectedContainer}>
          {/* Nút giảm số lượng sản phẩm trong giỏ */}
          <ScalePress onPress={removeCartHandler}>
            <Icon
              iconFamily="MaterialCommunityIcons"
              color={Colors.active} // Màu icon
              name="minus-thick" // Icon hình dấu trừ
              size={RFValue(13)} // Kích thước icon responsive
            />
          </ScalePress>

          {/* Hiển thị số lượng với hiệu ứng animation */}
          <AnimatedNumbers
            includeComma={false} // Không hiển thị dấu phẩy ngăn cách
            animationDuration={300} // Thời gian animation 300ms
            animateToNumber={data?.quantity} // Giá trị số lượng cần hiển thị
            fontStyle={styles.animatedCount} // Style cho số lượng
          />

          {/* Nút tăng số lượng sản phẩm */}
          <ScalePress onPress={addCartHandler}>
            <Icon
              iconFamily="MaterialCommunityIcons"
              color={Colors.active} // Màu icon
              name="plus-thick" // Icon hình dấu cộng
              size={RFValue(13)} // Kích thước icon responsive
            />
          </ScalePress>
        </View>

        {/* Nút "Add to Cart" */}
        <TouchableOpacity
          style={styles.addButtonContainer} 
          onPress={addItemIntoCart}
        >
            <CustomText color="#fff" fontFamily="Okra-Medium" variant="h5">
                Add item - ${data?.price}
            </CustomText>
        </TouchableOpacity>

        <SafeAreaView />
      </View>
    </View>
  );
};

export default AddItemModal;
