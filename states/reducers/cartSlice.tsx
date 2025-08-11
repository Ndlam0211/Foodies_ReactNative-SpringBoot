import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

interface CartItem {
  isVeg: boolean;
  id: string;
  name: string;
  price: number;
  quantity: number;
  cartPrice?: number;
  isCustomizable?: boolean;
  customizations?: any[];
}

interface RestaurantDetails {
  id: string;
  name: string;
  discount: string;
  discountAmount: string;
  time: string;
  distance: string;
  rating: number;
  imageUrl: string;
}

interface RestaurantCart {
    restaurant: RestaurantDetails,
    items: CartItem[]
}

interface CartState {
    carts: RestaurantCart[]
}

const initialState: CartState = {
    carts: []
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart: (
      state,
      action: PayloadAction<{
        restaurant: RestaurantDetails;
        item: CartItem;
      }>
    ) => {
      const { restaurant, item } = action.payload;

      // Tìm giỏ hàng của nhà hàng này
      const existingRestaurantCart = state.carts.find(
        (cart) => cart?.restaurant?.id === restaurant?.id
      );

      if (existingRestaurantCart) {
        // Tìm món trong giỏ hàng
        const existingItem = existingRestaurantCart?.items?.find(
          (cartItem) => cartItem?.id === item?.id
        );

        if (existingItem) {
          existingItem.quantity += 1;
          existingItem.cartPrice = (existingItem.cartPrice || 0) + existingItem?.price;
        } else {
          existingRestaurantCart?.items?.push({
            ...item,
            quantity: 1,
            cartPrice: item?.price,
          });
        }
      } else {
        // Chưa có giỏ hàng cho nhà hàng này → tạo mới
        state.carts.push({
          restaurant,
          items: [
            {
              ...item,
              quantity: 1,
              cartPrice: item?.price,
            },
          ],
        });
      }
    },

    removeItemFromCart: (
      state,
      action: PayloadAction<{
        restaurant_id: string;
        itemId: string;
      }>
    ) => {
      const { itemId, restaurant_id } = action?.payload;

      // Tìm giỏ hàng theo restaurant_id
      const restaurantCart = state?.carts?.find(
        (cart) => cart?.restaurant?.id === restaurant_id
      );

      if (!restaurantCart) return;

      // Tìm vị trí món ăn trong giỏ
      const itemIndex = restaurantCart.items?.findIndex(
        (item) => item?.id === itemId
      );

      if (itemIndex !== -1) {
        const item = restaurantCart?.items[itemIndex];

        if (item.quantity > 1) {
          // Giảm số lượng
          item.quantity -= 1;
          item.cartPrice = (item.cartPrice || 0) - item?.price;
        } else {
          // Xoá món nếu số lượng = 1
          restaurantCart.items.splice(itemIndex, 1);
        }
      }

      // Nếu giỏ hàng trống → xoá luôn nhà hàng khỏi state
      if (restaurantCart.items.length === 0) {
        state.carts = state.carts.filter(
          (cart) => cart.restaurant.id !== restaurant_id
        );
      }
    },

    addCustomizableItem: (
      state,
      action: PayloadAction<{
        restaurant: RestaurantDetails;
        item: CartItem;
        customization: {
          quantity: number;
          price: number;
          customizationOptions: any[];
        };
      }>
    ) => {
      const { restaurant, item, customization } = action.payload;

      // check xem đã tồn tại cart của nhà hàng này chưa
      const existingRestaurantCart = state.carts.find(
        cart => cart.restaurant.id === restaurant.id
      );

      // nếu đã tồn tại
      if (existingRestaurantCart) {
        // check xem item cần thêm đã tồn tại hay chưa
        const existingItem = existingRestaurantCart?.items?.find(
          cartItem => cartItem?.id === item?.id,
        ) as any;

        // nếu rồi điều chỉnh số lượng
        if (existingItem) {
          // Tìm index của customization đã tồn tại trong item
          const existingCustomizationIndex =
            existingItem?.customizations?.findIndex(
              (cust: any) =>
                JSON.stringify(cust.customizationOptions) ===
                JSON.stringify(customization.customizationOptions)
            );

          // Nếu tìm thấy customization đã tồn tại
          if (
            existingCustomizationIndex !== undefined &&
            existingCustomizationIndex !== -1
          ) {            
            const existingCustomization =
              existingItem?.customizations[existingCustomizationIndex];

            // Cộng thêm số lượng mới vào số lượng cũ
            existingCustomization.quantity += customization?.quantity;

            // Cập nhật lại tổng giá của customization này
            existingCustomization.cartPrice += customization?.price;
          } else {
            
            const newCustomizationId = uuidv4();
            
            existingItem?.customizations?.push({
              id: newCustomizationId,
              ...customization, // Sao chép dữ liệu customization gốc
              quantity: customization?.quantity, // Số lượng của customization
              cartPrice: customization?.price, // Giá customization
              price: customization?.price / customization?.quantity // Giá 1 đơn vị
            });
          }

          existingItem.quantity += customization?.quantity;
          existingItem.cartPrice = (existingItem?.cartPrice || 0) + customization?.price;
        } else {
          // nếu item ch tồn tại, thêm mới vào existingRestaurantCart
          const newCustomizationId = `c1`;
          existingRestaurantCart.items.push({
            ...item, // Sao chép toàn bộ thông tin item
            quantity: customization.quantity, // Số lượng sản phẩm
            cartPrice: customization.price, // Giá của sản phẩm trong giỏ

            // Danh sách các customization của sản phẩm
            customizations: [
              {
                id: newCustomizationId,
                ...customization, // Sao chép dữ liệu customization gốc
                quantity: customization.quantity, // Số lượng của customization
                cartPrice: customization.price, // Giá customization
                price: customization.price / customization.quantity, // Giá 1 đơn vị
              },
            ],
          });
        }
      } else {
        // nếu nhà hàng chưa tồn tại cart thì thêm cart mới cho nhà hàng

        // Tạo id mới cho customization
        const newCustomizationId = `c1`;

        // Thêm một cart mới vào state
        state.carts.push({
          restaurant, // Thông tin nhà hàng
          items: [
            {
              ...item, // Sao chép toàn bộ thông tin item
              quantity: customization.quantity, // Số lượng sản phẩm
              cartPrice: customization?.price, // Giá của sản phẩm trong giỏ

              // Danh sách các customization của sản phẩm
              customizations: [
                {
                  id: newCustomizationId,
                  ...customization, // Sao chép dữ liệu customization gốc
                  quantity: customization?.quantity, // Số lượng của customization
                  cartPrice: customization.price, // Giá customization
                  price: customization.price / customization.quantity, // Giá 1 đơn vị
                },
              ],
            },
          ],
        });
      }
    },

    removeCustomizableItem: (
      state,
      action: PayloadAction<{
        restaurant_id: string;
        itemId: string;
        customizationId: string;
      }>
    ) => {
      const { restaurant_id, itemId, customizationId } = action.payload;

      // Tìm giỏ hàng của nhà hàng tương ứng
      const restaurantCart = state?.carts?.find(
        (cart) => cart?.restaurant?.id === restaurant_id
      );
      if (!restaurantCart) return;

      // Tìm item trong giỏ hàng
      const item = restaurantCart?.items?.find(
        (cartItem) => cartItem?.id === itemId
      );
      if (!item) return;

      // Tìm index của customization
      const customizationIndex = item?.customizations?.findIndex(
        (cust) => cust?.id === customizationId
      ) as number;

      if (customizationIndex !== -1 && item?.customizations) {
        const customization = item.customizations[customizationIndex];

        if (customization?.quantity > 1) {
          // Giảm số lượng và giá
          customization.quantity -= 1;
          customization.cartPrice -= customization?.price;
        } else {
          // Xoá customization
          item?.customizations?.splice(customizationIndex, 1);
        }

        item.quantity -= 1;
        item.cartPrice = (item?.cartPrice || 0) - customization?.price;
        
        // Nếu item không còn customization và quantity === 0 → xoá item
        if (item?.quantity === 0 && item?.customizations?.length === 0) {
          restaurantCart.items = restaurantCart?.items?.filter(
            (cartItem) => cartItem.id !== itemId
          );
        }

        // Nếu giỏ hàng của nhà hàng không còn item → xoá luôn giỏ hàng đó
        if (restaurantCart?.items?.length === 0) {
          state.carts = state.carts?.filter(
            (cart) => cart?.restaurant?.id !== restaurant_id
          );
        }
      }

    },

    updateCustomizableItem: (
      state,
      action: PayloadAction<{
        restaurant_id: string;
        itemId: string;
        customizationId: string;
        newCustomization: {
          quantity: number;
          price: number;
          customizationOptions: any[];
        };
      }>
    ) => {
      const { restaurant_id, itemId, customizationId, newCustomization } =
        action.payload;

      // Tìm giỏ hàng của đúng nhà hàng
      const restaurantCart = state.carts.find(
        (cart) => cart.restaurant.id === restaurant_id
      );
      if (!restaurantCart) return;

      // Tìm item trong giỏ hàng
      const item = restaurantCart.items.find(
        (cartItem) => cartItem.id === itemId
      );
      if (!item || !item.customizations) return;

      // Tìm customization có options giống newCustomization (trừ customization hiện tại)
      const matchingCustomizationIndex = item.customizations.findIndex(
        (cust) =>
          cust.id !== customizationId &&
          JSON.stringify(cust.customizationOptions) ===
            JSON.stringify(newCustomization.customizationOptions)
      );

      // Tìm customization đang muốn thay đổi
      const targetCustomizationIndex = item?.customizations.findIndex(
        (cust) => cust.id === customizationId
      );
      if (targetCustomizationIndex === -1) return;

      const targetCustomization =
        item?.customizations[targetCustomizationIndex];

      // Nếu đã tồn tại customization có options giống nhau → gộp vào
      if (matchingCustomizationIndex !== -1) {
        const matchingCustomization =
          item.customizations[matchingCustomizationIndex];

        matchingCustomization.quantity += newCustomization?.quantity;
        matchingCustomization.cartPrice += newCustomization.price;

        // Xóa customization cũ
        item?.customizations?.splice(targetCustomizationIndex, 1);
      } else {
        // Cập nhật customization hiện tại
        targetCustomization.quantity = newCustomization.quantity;
        targetCustomization.cartPrice = newCustomization.price;
        targetCustomization.price =
          newCustomization.price / newCustomization.quantity;
        targetCustomization.customizationOptions =
          newCustomization.customizationOptions;
      }

      // Mục đích: Cập nhật lại tổng số lượng (quantity) và tổng giá (cartPrice) của một item
      // dựa trên danh sách các "customizations" (tùy chọn) hiện có.

      // Tính lại tổng số lượng của item
      item.quantity = item?.customizations?.reduce(
        // sum: biến cộng dồn, cust: từng phần tử trong mảng customizations
        (sum, cust) => sum + cust.quantity, // cộng dồn số lượng từ từng customization
        0 // giá trị khởi tạo ban đầu của sum
      );

      // Tính lại tổng giá của item
      item.cartPrice = item?.customizations?.reduce(
        // sum: biến cộng dồn, cust: từng phần tử trong mảng customizations
        (sum, cust) => sum + cust.cartPrice, // cộng dồn giá từ từng customization
        0 // giá trị khởi tạo ban đầu của sum
      );
    },

    clearAllCarts: (state) => {
      state.carts = [];
    },

    clearRestaurantCart: (
      state,
      action: PayloadAction<{ restaurant_id: string }>
    ) => {
      const { restaurant_id } = action.payload;
      
      state.carts = state.carts.filter(
        (cart) => cart?.restaurant?.id !== restaurant_id
      );
    },
  },
});

export const { addItemToCart, removeItemFromCart, clearAllCarts, clearRestaurantCart, addCustomizableItem, removeCustomizableItem, updateCustomizableItem } = cartSlice.actions;

// Lấy toàn bộ cart state
export const selectCart = (state: RootState) => state.cart;

// Lấy giỏ hàng của một nhà hàng cụ thể
export const selectRestaurantCart = (restaurantId: string) =>
  createSelector(
    (state: RootState) =>
      state.cart.carts.find(
        (cart) => cart.restaurant.id === restaurantId
      ),
    restaurantCart => (restaurantCart ? [...restaurantCart.items] : [])
  );

// Lấy 1 item cụ thể trong giỏ hàng của một nhà hàng
export const selectRestaurantCartItem = (
  restaurantId: string,
  itemId: string
) =>
  createSelector(
    (state: RootState) =>
      state.cart.carts.find(
        cart => cart.restaurant.id === restaurantId
      )?.items,
    items => items?.find((item) => item.id === itemId) || null
  );

export default cartSlice.reducer;
