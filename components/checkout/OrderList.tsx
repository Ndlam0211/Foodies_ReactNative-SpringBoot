import React, { FC } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import CustomText from "../global/CustomText";
import { Colors } from "@/unistyles/Constants";
import MiniFoodCard from "../restaurant/MiniFoodCard";
import NonCustomizableCard from "./NonCustomizableCard";

const OrderList: FC<{
  restaurant: any;
  cartItems: any;
  totalItems: number;
}> = ({ cartItems, restaurant, totalItems }) => {
  return (
    <View style={styles.container}>
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

      {cartItems?.map((item: any, index: number) => (
        <View key={index} style={styles.subContainer}>
          {item?.isCustomizable ? (
            <>
              {item?.customizations?.map((cus: any, idx: number) => (
                <MiniFoodCard
                  key={idx}
                  cus={cus}
                  item={item}
                  restaurant={restaurant}
                />
              ))}
            </>
          ) : (
            <NonCustomizableCard item={item} restaurant={restaurant} />
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom:15
  },
  subContainer: {
    margin:10
  },
  img: {
    width:30,
    height:30
  },
  imgContainer: {
    padding:10,
    borderRadius:15,
    backgroundColor: Colors.background_light
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap:12,
    paddingHorizontal:10,
    paddingVertical:12
  },
});

export default OrderList;
