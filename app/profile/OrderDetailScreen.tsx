import { crudService } from "@/api/apiService";
import CustomText from "@/components/global/CustomText";
import { loginStyles } from "@/unistyles/authStyles";
import { Colors } from "@/unistyles/Constants";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStyles } from "react-native-unistyles";

const OrderDetailScreen: React.FC = () => {
  const { styles } = useStyles(loginStyles);
  const route = useRoute() as any;
  const navigation = useNavigation();
  const orderId = route?.params?.orderId;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!orderId) return;
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await crudService.get(`orders/${orderId}`);
        setOrder(data);
      } catch (e) {
        console.warn(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [orderId]);

  if (loading || !order) {
    return (
      <View style={[styles.container, localStyles.center]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const items = order.orderItems || [];
//   const total = items.reduce(
//     (s: number, it: any) => s + (it.product.price || 0),
//     0
//   );


  return (
    <View style={styles.container}>
        <SafeAreaView />
      <View style={{ padding: 12 }}>
        <CustomText variant="h3" fontFamily="Okra-Bold">
          Order #{order.orderId}
        </CustomText>
        <CustomText style={{ color: "#666", marginTop: 6 }}>
          {order.orderDate}
        </CustomText>
        <CustomText style={{ marginTop: 8 }} fontFamily="Okra-Bold">
          Payment: {order.payment?.paymentMethod || "-"}
        </CustomText>
        <CustomText style={{ marginTop: 4 }}>
          Status: {order.orderStatus}
        </CustomText>
      </View>

      <FlatList
        data={items}
        keyExtractor={(i: any) => String(i.orderItemId || i.product?.productId)}
        renderItem={({ item }) => (
          <View style={localStyles.itemRow}>
            <Image
              source={{ uri: item.product?.image }}
              style={localStyles.itemImg}
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <CustomText fontFamily="Okra-Bold">
                {item.product?.productName}
              </CustomText>
              <CustomText style={{ color: "#666", marginTop: 6 }}>
                {item.quantity} x ${(item.product?.price || 0).toLocaleString()}{" "}
              </CustomText>
            </View>
            <CustomText fontFamily="Okra-Bold">
              ${(item.product?.price || 0) * (item.quantity || 1).toLocaleString()}{" "}
            </CustomText>
          </View>
        )}
      />

      <View style={{ padding: 12 }}>
        {/* <CustomText fontFamily="Okra-Bold">
          Total: ${(order.totalAmount || 0).toLocaleString()}
        </CustomText> */}
        <TouchableOpacity
          style={[styles.buttonContainer, { marginTop: 12 }]}
          onPress={() => navigation.goBack()}
        >
          <CustomText color="#fff">Back</CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  center: { justifyContent: "center", alignItems: "center", flex: 1 },
  itemRow: {
    flexDirection: "row",
    padding: 12,
    alignItems: "center",
    backgroundColor: "#fff",
    marginBottom: 8,
    borderRadius: 8,
  },
  itemImg: { width: 68, height: 68, borderRadius: 8 },
});

export default OrderDetailScreen;
