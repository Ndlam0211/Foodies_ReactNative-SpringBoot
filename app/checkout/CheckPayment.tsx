import { crudService } from "@/api/apiService";
import { useMessage } from "@/hooks/useMessage";
import { clearRestaurantCart } from "@/states/reducers/cartSlice";
import { useAppDispatch } from "@/states/reduxHook";
import { replace } from "@/utils/NavigationUtils";
import { useRoute } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type CheckPaymentRouteParams = {
  vnp_ResponseCode?: string;
  [key: string]: any;
};

const CheckPayment = () => {
  const route = useRoute();
  const dispatch = useAppDispatch();
  const { showSuccess, showError } = useMessage();

  const params = useMemo(
    () => (route.params || {}) as CheckPaymentRouteParams,
    [route.params]
  );

  const [status, setStatus] = useState<"success" | "error">("error");
  const [title, setTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const goHome = () => {
    replace("UserBottomTab");
  };

  useEffect(() => {
    let processed = false;

    const handle = async () => {
      if (processed) return; // Ngăn gọi nhiều lần
      processed = true;

      try {
        console.log("params: ", params);

        if (params.vnp_ResponseCode === "00") {
          setStatus("success");
          setTitle("Thanh toán thành công");
          const restaurantId = params.restaurant_id;

          if (!restaurantId) {
            setStatus("error");
            setTitle("Thiếu thông tin cửa hàng");
            return;
          }

          setLoading(true);
          try {
            await crudService.create("orders/place", {
              restaurantId,
              paymentMethod: "vnpay",
            });

            // Clear cart
            dispatch(clearRestaurantCart({ restaurant_id: restaurantId }));
            console.log("Cart cleared");

            // Give user a short moment to see the success toast, then replace the
            // navigation stack to OrderSuccessScreen so the WebView (CheckoutScreen)
            // is removed and user can't go back into the VNPay flow.
            setTimeout(() => {
              replace("OrderSuccessScreen", {
                restaurant: { id: restaurantId },
              });
            }, 1000);
            showSuccess("Đặt hàng thành công");
          } catch (error) {
            console.error("Error placing order:", error);
            setStatus("error");
            setTitle("Đặt hàng thất bại");
            showError?.("Không thể đặt hàng. Vui lòng thử lại.");
          } finally {
            setLoading(false);
          }
        } else if (params.vnp_ResponseCode === "24") {
          setStatus("error");
          setTitle("Khách hàng hủy thanh toán");
        } else {
          setStatus("error");
          setTitle("Thanh toán thất bại");
        }
      } catch (err) {
        console.error(err);
        setStatus("error");
        setTitle("Có lỗi xảy ra khi kiểm tra thanh toán");
      }
    };

    handle();
  }, [dispatch, params, showError, showSuccess]);

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.title,
          status === "success" ? styles.success : styles.error,
        ]}
      >
        {title}
      </Text>

      {loading ? (
        <View style={{ marginTop: 12 }}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={[styles.subTitle, { marginTop: 8 }]}>
            Đang xử lý đơn hàng...
          </Text>
        </View>
      ) : (
        <Text style={styles.subTitle}>Order number: {params.vnp_TxnRef}</Text>
      )}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={goHome}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Please wait" : "Go Home"}
          </Text>
        </TouchableOpacity>
        {status === "success" && (
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => replace("UserBottomTab", { screen: "Reorder" })}
            disabled={loading}
          >
            <Text style={styles.buttonText}>View Order</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  success: {
    color: "green",
  },
  error: {
    color: "red",
  },
  subTitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 24,
    gap: 12,
  },
  button: {
    backgroundColor: "#eee",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 6,
  },
  primaryButton: {
    backgroundColor: "#007bff",
  },
  secondaryButton: {
    backgroundColor: "#6c757d",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loading: {
    marginTop: 16,
    color: "#888",
  },
});

export default CheckPayment;
