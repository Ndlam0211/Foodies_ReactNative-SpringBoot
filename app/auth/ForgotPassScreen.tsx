import CustomText from "@/components/global/CustomText";
import BreakerText from "@/components/ui/BreakerText";
import Input from "@/components/ui/Input";
import SocialLogin from "@/components/ui/SocialLogin";
import { loginStyles } from "@/unistyles/authStyles";
import { navigate } from "@/utils/NavigationUtils";
import useKeyboardOffsetHeight from "@/utils/useKeyboardOffsetHeight";
import { StatusBar } from "expo-status-bar";
import React, { FC, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";
import { useStyles } from "react-native-unistyles";
// ...existing code... (no token handling needed for forgot password)
import axiosInstance from "@/api/apiConfig";
import { useMessage } from "@/hooks/useMessage";

const ForgotPassScreen: FC = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const keyboardOffsetHeight = useKeyboardOffsetHeight();
  const { styles } = useStyles(loginStyles);
  const [email, setEmail] = useState("");
  // only email is needed for forgot password
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useMessage();

  useEffect(() => {
    if (keyboardOffsetHeight === 0) {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animatedValue, {
        toValue: -keyboardOffsetHeight * 0.25,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [keyboardOffsetHeight, animatedValue]);

  const handleSendReset = async () => {
    setLoading(true);

    await axiosInstance
      .post("forgot-password", { email })
      .then((response) => {
        showSuccess(
          response?.data?.message || "New password already sent to your email."
        );
      })
      .catch((error) => {
        const errorResponse = error?.response?.data;

        if (errorResponse?.message) {
          showError(errorResponse.message);
        } else if (errorResponse?.email) {
          showError(errorResponse.email);
        } 
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={Platform.OS !== "ios"} />

      <Image
        source={require("@/assets/images/login.png")}
        style={styles.cover}
      />

      <Animated.ScrollView
        bounces={false}
        style={{ transform: [{ translateY: animatedValue }] }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.bottomContainer}
      >
        <CustomText fontFamily="Okra-Bold" variant="h2" style={styles.title}>
          Vietnam&apos;s #1 Food Delivery and Dining App
        </CustomText>

        <BreakerText text="Forgot password" />

        <Input value={email} title="Email" onChangeText={setEmail} />

        <TouchableOpacity
          style={styles.buttonContainer}
          disabled={loading}
          onPress={handleSendReset}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <CustomText color="#fff" fontFamily="Okra-Medium" variant="h5">
              Send
            </CustomText>
          )}
        </TouchableOpacity>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <CustomText fontFamily="Okra-Medium" variant="h6">
            Don&apos;t have an account?
          </CustomText>
          <TouchableOpacity onPress={() => navigate("SignupScreen")}>
            <CustomText color="blue" fontFamily="Okra-Medium" variant="h6">
              Sign up
            </CustomText>
          </TouchableOpacity>
        </View>

        <BreakerText text="or" />
        <SocialLogin />
      </Animated.ScrollView>
    </View>
  );
};

export default ForgotPassScreen;
