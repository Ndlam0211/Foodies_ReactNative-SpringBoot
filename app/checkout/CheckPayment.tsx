import { resetAndNavigate } from "@/utils/NavigationUtils";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const CheckPayment = () => {
  const route = useRoute();

  const [status, setStatus] = useState<"success" | "error">("error");
  const [title, setTitle] = useState<string>("");
  const [loading, setLoading] = useState(false);

  type PaymentParams = {
    paymentMethod?: string;
    status?: string | number;
    queryString?: string;
    [key: string]: any;
  };

  const goHome = () => {
    resetAndNavigate("UserBottomTab");
  };

  useEffect(() => {
    const params = (route.params || {}) as PaymentParams;
    (async () => {
      try {
        console.log("params: ", params);
        setLoading(true);
        const { data } = await axios.get(
          `http://localhost:8080/api/public/vnpay/callback?${
            params.queryString || ""
          }`
        );
        setLoading(false);
        if (data.data.vnp_ResponseCode === "00") {
          setStatus("success");
          setTitle("Thanh toán thành công");
        } else if (data.data.vnp_ResponseCode === "24") {
          setStatus("error");
          setTitle("Khách hàng hủy thanh toán");
        } else {
          setStatus("error");
          setTitle("Thanh toán thất bại");
        }
      } catch {
        setLoading(false);
        setStatus("error");
        setTitle("Có lỗi xảy ra khi kiểm tra thanh toán");
      }
    })();
  }, [route.params]);
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
      <Text style={styles.subTitle}>Order number: 2017182818828182881</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={goHome}
        >
          <Text style={styles.buttonText}>Go Home</Text>
        </TouchableOpacity>
      </View>
      {loading && (
        <Text style={styles.loading}>Đang kiểm tra thanh toán...</Text>
      )}
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
