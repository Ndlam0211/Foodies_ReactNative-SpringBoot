import { crudService } from "@/api/apiService";
import CustomText from "@/components/global/CustomText";
import { loginStyles } from "@/unistyles/authStyles";
import { Colors } from "@/unistyles/Constants";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
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

type OrderItem = {
  orderId: number;
  orderDate?: string;
  totalAmount?: number;
  orderItems: any[];
  orderStatus?: string;
  email?: string;
  // other fields can exist (orderItems, payment...)
};

const OrderHistoryScreen: React.FC = () => {
  const { styles } = useStyles(loginStyles);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);
      const resp = await crudService.get("orders/my-orders");
      const data = resp;

      console.log("data", JSON.stringify(data, null, 2));

      // response may be an array or { data: [...] }
      let list: any[] = [];
      if (Array.isArray(data)) list = data;
      else if (Array.isArray(data?.data)) list = data.data;

      if (list.length > 0) {
        // newest first by orderDate
        const sorted = list.sort((a: any, b: any) => {
          const ta = new Date(
            a.orderDate || a.createdAt || a.created_at || 0
          ).getTime();
          const tb = new Date(
            b.orderDate || b.createdAt || b.created_at || 0
          ).getTime();
          return tb - ta;
        });
        setOrders(sorted);
      } else {
        setOrders([]);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Could not load orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (isFocused) fetchOrders(true);
  }, [isFocused, fetchOrders]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchOrders(false);
  }, [fetchOrders]);

  const renderItem = ({ item }: { item: OrderItem }) => {
    const date = item.orderDate || "";
    const total = item.totalAmount ?? 0;
    // const total = item.orderItems.reduce((s: number, it: any) => s + (it.product.price * it.product.quantity || 0), 0);
    const status = item.orderStatus || "Pending";

    const firstItem = (item as any).orderItems?.[0] || null;
    const product = firstItem?.product;
    const image = product?.image;
    const productName = product?.productName || "Item";

    const itemCount = Array.isArray((item as any).orderItems)
      ? (item as any).orderItems.reduce(
          (s: number, it: any) => s + (it.quantity || 0),
          0
        )
      : 0;

    const badgeColor =
      (status || "").toLowerCase() === "confirmed"
        ? Colors.active
        : (status || "").toLowerCase() === "pending"
        ? "#ff9900"
        : "#e53935";

    return (
      <TouchableOpacity
        style={localStyles.card}
        activeOpacity={0.9}
        onPress={() =>
          (navigation as any).navigate?.("OrderDetail", {
            orderId: item.orderId,
          })
        }
      >
        <View style={localStyles.cardLeft}>
          {image ? (
            <Image source={{ uri: image }} style={localStyles.thumb} />
          ) : (
            <View style={[localStyles.thumb, { backgroundColor: "#f0f0f0" }]} />
          )}
        </View>

        <View style={localStyles.cardBody}>
          <View style={localStyles.rowTop}>
            <CustomText fontFamily="Okra-Bold" numberOfLines={1}>
              {productName}
            </CustomText>
            <View style={[localStyles.badge, { backgroundColor: badgeColor }]}>
              <CustomText color="#fff" fontSize={12}>
                {status}
              </CustomText>
            </View>
          </View>

          <CustomText fontSize={12} style={{ color: "#666", marginTop: 6 }}>
            {date ? new Date(date).toLocaleString() : "-"} • {itemCount} item
            {itemCount > 1 ? "s" : ""}
          </CustomText>

          <View style={localStyles.rowBottom}>
            <CustomText fontFamily="Okra-Bold">
              ${total.toLocaleString()}
            </CustomText>
            <CustomText fontSize={12} style={{ color: "#666" }}>
              {(item as any).payment?.paymentMethod || "-"}
            </CustomText>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, localStyles.center]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, localStyles.center]}>
        <CustomText fontFamily="Okra-Bold">Error</CustomText>
        <CustomText style={{ marginTop: 8 }}>{error}</CustomText>
        <TouchableOpacity
          style={[styles.buttonContainer, { marginTop: 12 }]}
          onPress={() => fetchOrders(true)}
        >
          <CustomText color="#fff">Try again</CustomText>
        </TouchableOpacity>
      </View>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <View style={[styles.container, localStyles.center]}>
        <CustomText fontFamily="Okra-Bold">No orders yet</CustomText>
        <CustomText style={{ marginTop: 8 }}>
          You have not placed any orders yet.
        </CustomText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView/>
      <FlatList
        data={orders}
        keyExtractor={(i) => String(i.orderId)}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={localStyles.sep} />}
        contentContainerStyle={{ padding: 12 }}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </View>
  );
};

const localStyles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  cardLeft: {
    width: 72,
    height: 72,
    marginRight: 12,
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: 8,
  },
  cardBody: {
    flex: 1,
  },
  rowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rowBottom: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sep: { height: 10 },
  center: { justifyContent: "center", alignItems: "center", flex: 1 },
});

export default OrderHistoryScreen;
