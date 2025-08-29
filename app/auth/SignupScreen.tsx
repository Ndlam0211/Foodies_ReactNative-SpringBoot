import {
  View,
  Animated,
  Platform,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { FC, FormEvent, useEffect, useRef, useState } from "react";
import { useStyles } from "react-native-unistyles";
import { loginStyles } from "@/unistyles/authStyles";
import { StatusBar } from "expo-status-bar";
import CustomText from "@/components/global/CustomText";
import BreakerText from "@/components/ui/BreakerText";
import Input from "@/components/ui/Input";
import { navigate, resetAndNavigate } from "@/utils/NavigationUtils";
import SocialLogin from "@/components/ui/SocialLogin";
import useKeyboardOffsetHeight from "@/utils/useKeyboardOffsetHeight";
import { setAccessToken, setUserId } from "@/api/apiService";
import { useMessage } from "@/hooks/useMessage";
import axiosInstance from "@/api/apiConfig";

const SignupScreen: FC = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const keyboardOffsetHeight = useKeyboardOffsetHeight();
  const { styles } = useStyles(loginStyles);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
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

  const handleSignup = async () => {
    setLoading(true);

    await axiosInstance
      .post("register", { email, password })
      .then((response) => {
        const token = response?.data?.token;
        if (token) {
          setAccessToken(token);
          setUserId(response?.data?.userId);
          resetAndNavigate("UserBottomTab");
          showSuccess("Signup successful!");
        } else {
          console.log("Token not found in response");
          setLoading(false);
          showError("Signup failed: Token not found in response.");
        }
      })
      .catch((error) => {
        const errorResponse = error?.response?.data;
        if (errorResponse?.message) {
          showError(errorResponse.message);
        } else if (errorResponse?.email) {
          showError(errorResponse.email);
        } else if (errorResponse?.password) {
          showError(errorResponse.password);
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

        <BreakerText text="Sign up" />

        <Input value={email} title="Email" onChangeText={setEmail} />
        <Input value={password} title="Password" onChangeText={setPassword} />

        <TouchableOpacity
          style={styles.buttonContainer}
          disabled={loading}
          onPress={handleSignup}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <CustomText color="#fff" fontFamily="Okra-Medium" variant="h5">
              Sign up
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
            Already have an account?
          </CustomText>
          <TouchableOpacity onPress={() => navigate("LoginScreen")}>
            <CustomText color="blue" fontFamily="Okra-Medium" variant="h6">
              Login
            </CustomText>
          </TouchableOpacity>
        </View>

        <BreakerText text="or" />
        <SocialLogin />
      </Animated.ScrollView>
    </View>
  );
};

export default SignupScreen;
