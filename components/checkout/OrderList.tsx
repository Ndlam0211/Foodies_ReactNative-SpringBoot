import { deleteItemFromCart } from "@/states/reducers/cartSlice";
import { useAppDispatch } from "@/states/reduxHook";
import { Colors } from "@/unistyles/Constants";
import React, { FC, useCallback, useMemo } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import CustomText from "../global/CustomText";
import MiniFoodCard from "../restaurant/MiniFoodCard";
import NonCustomizableCard from "./NonCustomizableCard";

const OrderList: FC<{
  restaurant: any;
  cartItems: any[];
  totalItems: number;
}> = ({ cartItems, restaurant, totalItems }) => {
  const dispatch = useAppDispatch();
  const deleteItem = useCallback(
    (id: any) => {
      dispatch(
        deleteItemFromCart({ restaurant_id: restaurant.id, itemId: id })
      );
    },
    [dispatch, restaurant?.id]
  );

  const renderItem = useCallback(
    ({ item }: any) => {
      return (
        <View style={styles.rowFront}>
          {item?.isCustomizable ? (
            item?.customizations?.map((cus: any, idx: number) => (
              <MiniFoodCard
                key={idx}
                cus={cus}
                item={item}
                restaurant={restaurant}
              />
            ))
          ) : (
            <NonCustomizableCard item={item} restaurant={restaurant} />
          )}
        </View>
      );
    },
    [restaurant]
  );

  const renderHiddenItem = useCallback(
    ({ item }: any) => (
      <View style={styles.rowBack}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: "#ff3b30" }]}
          onPress={() => deleteItem(item.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.backText}>Delete</Text>
        </TouchableOpacity>
      </View>
    ),
    [deleteItem]
  );

  const data = useMemo(() => cartItems, [cartItems]);

  const onRowDidOpen = (rowKey: string) => {
    console.log("Row opened:", rowKey);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.flexRow}>
        <View style={styles.imgContainer}>
          <Image
            source={require("@/assets/icons/clock.png")}
            style={styles.img}
          />
        </View>

        <View>
          <CustomText fontSize={12} fontFamily="Okra-Bold">
            Delivery in 30 minutes
          </CustomText>
          <CustomText
            style={{ opacity: 0.5 }}
            variant="h6"
            fontFamily="Okra-Medium"
          >
            Shipment of {totalItems} item
          </CustomText>
        </View>
      </View>

      {/* Swipe list */}
      <SwipeListView
        style={{ flexGrow: 1, flex: 1 }}
        data={data}
        keyExtractor={(item, i) => (item?.id ? String(item.id) : String(i))}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-75}
        previewOpenValue={-40}
        previewOpenDelay={3000}
        onRowDidOpen={onRowDidOpen}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        updateCellsBatchingPeriod={50}
        removeClippedSubviews
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 15,
  },
  subContainer: {
    margin: 10,
  },
  img: {
    width: 30,
    height: 30,
  },
  imgContainer: {
    padding: 10,
    borderRadius: 15,
    backgroundColor: Colors.background_light,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  rowFront: {
    backgroundColor: "#fff",
    padding: 10,
  },
  rowBack: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  backBtn: {
    width: 75,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  backText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default OrderList;
