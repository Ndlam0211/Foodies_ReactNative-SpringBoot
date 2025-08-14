import ArrowButton from "@/components/checkout/ArrowButton";
import BillDetails from "@/components/checkout/BillDetails";
import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import OrderList from "@/components/checkout/OrderList";
import CustomText from "@/components/global/CustomText";
import Icon from "@/components/global/Icon";
import { selectRestaurantCart } from "@/states/reducers/cartSlice";
import { useAppSelector } from "@/states/reduxHook";
import { Colors } from "@/unistyles/Constants";
import { goBack, navigate } from "@/utils/NavigationUtils";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import React, { FC, useEffect, useState } from "react";
import { Image, Platform, StyleSheet, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

const CheckoutScreen: FC = () => {
  const route = useRoute() as any;
  const restaurant = route?.params?.item;
  const cart = useAppSelector(selectRestaurantCart(restaurant?.id));

  const [paymentUrl, setPaymentUrl] = React.useState(null);

  const totalItemPrice =
    cart?.reduce((total, item) => total + (item.cartPrice || 0), 0) || 0;

  const totalItems =
    cart?.reduce((total, item) => total + (item.quantity || 0), 0) || 0;

  const insets = useSafeAreaInsets();
  const [loading] = useState(false); // reserved for future loading indicator

  const startPayment = async () => {
    console.log("Starting payment...: ", totalItemPrice + 34);

    try {
      const resp = await axios.get(
        "http://192.168.2.26:8080/api/public/vnpay/create-payment",
        {
          params: {
            amount: totalItemPrice + 34,
          },
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJVc2VyIERldGFpbHMiLCJpc3MiOiJFdmVudCBTY2hlZHVsZXIiLCJpYXQiOjE3NTUxNDM0MzMsImVtYWlsIjoic3RyaW5nQGdtYWlsLmNvbSJ9.ZUgqKakIPqF71oswPqgrS-x4PuR2Rq1ZKYdWnNeIHI0",
          },
        }
      );
      const data = await resp.data;
      console.log("url: ", data.data.paymentUrl);

      setPaymentUrl(data.data.paymentUrl);
    } catch (error) {
      console.error("Error creating payment: ", error);
    }
  };

  useEffect(() => {
    if (!cart || cart?.length === 0) {
      goBack();
    }
  }, [cart]);

  // const handlePlaceOrder = async () => {
  //   setLoading(true);
  //   setTimeout(() => {
  //     setLoading(false);

  //     startPayment();

  //     replace("OrderSuccessScreen", {
  //       restaurant: restaurant,
  //     });
  //   }, 3000);
  // };

  if (paymentUrl) {
    const handleUrl = (url: string) => {
      if (!url) return;
      if (url.startsWith("foodies://")) {
        const normalized = url.replace("foodies://", "").replace(/\/+/g, "/");
        const [path, query] = normalized.split("?");
        if (
          path.toLowerCase() === "checkout/checkpayment" ||
          path.toLowerCase() === "checkpayment"
        ) {
          navigate("CheckPayment", {
            paymentMethod: "vnpay",
            queryString: query,
          });
        }
      }
    };
    return (
      <WebView
        source={{ uri: paymentUrl }}
        onShouldStartLoadWithRequest={(req) => {
          handleUrl(req.url);
          return !req.url.startsWith("foodies://");
        }}
        onNavigationStateChange={(navState) => handleUrl(navState.url)}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={{ height: Platform.OS === "android" ? insets.top : 0 }} />
      <CheckoutHeader title={restaurant?.name} />

      <View style={styles.scrollContainer}>
        <OrderList
          cartItems={cart}
          restaurant={restaurant}
          totalItems={totalItems}
        />

        <View style={styles.flexRowBetween}>
          <View style={styles.flexRow}>
            <Image
              source={require("@/assets/icons/coupon.png")}
              style={{ width: 25, height: 25 }}
            />
            <CustomText variant="h6" fontFamily="Okra-Medium">
              View all restaurant coupons
            </CustomText>
          </View>
          <Icon
            iconFamily="MaterialCommunityIcons"
            name="chevron-right"
            size={RFValue(16)}
            color={Colors.text}
          />
        </View>

        <BillDetails totalItemPrice={totalItemPrice} />

        {/* <View style={styles.flexRowBetween}>
          <View>
            <CustomText fontSize={10} fontFamily="Okra-Medium">
              Cancellation Policy
            </CustomText>
            <CustomText
              fontSize={9}
              style={styles.cancelText}
              fontFamily="Okra-Bold"
            >
              Orders cannot be cancelled once packed for delivery. In case of
              unexpected delays, a refund will be provided, if applicable
            </CustomText>
          </View>
        </View> */}
      </View>

      <View style={styles.paymentGateway}>
        <View style={{ width: "30%" }}>
          <CustomText fontSize={RFValue(6)} fontFamily="Okra-Medium">
            💵 PAY USING
          </CustomText>
          <CustomText
            fontSize={10}
            style={{ marginTop: 2 }}
            fontFamily="Okra-Medium"
          >
            Cash on Delivery
          </CustomText>
        </View>

        <View style={{ width: "70%" }}>
          <ArrowButton
            loading={loading}
            price={totalItemPrice}
            title="Place Order"
            onPress={startPayment}
          />
        </View>
      </View>
      <SafeAreaView />
    </View>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  cancelText: {
    marginTop: 4,
    opacity: 0.6,
  },
  paymentGateway: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 14,
    backgroundColor: "white",
    position: "absolute",
    paddingTop: 10,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    elevation: 5,
    shadowRadius: 5,
    shadowColor: Colors.lightText,
    bottom: 0,
    paddingBottom: Platform.OS === "ios" ? 25 : 5,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: Colors.background_light,
  },
  flexRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  flexRowBetween: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 15,
  },
});
