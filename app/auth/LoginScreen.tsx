import axiosInstance from "@/api/apiConfig";
import { setAccessToken, setUserId } from "@/api/apiService";
import CustomText from "@/components/global/CustomText";
import BreakerText from "@/components/ui/BreakerText";
import Input from "@/components/ui/Input";
import SocialLogin from "@/components/ui/SocialLogin";
import { useMessage } from "@/hooks/useMessage";
import { setUser } from "@/states/reducers/userSlice";
import { useAppDispatch } from "@/states/reduxHook";
import { loginStyles } from "@/unistyles/authStyles";
import { navigate, resetAndNavigate } from "@/utils/NavigationUtils";
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

const LoginScreen: FC = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const keyboardOffsetHeight = useKeyboardOffsetHeight();
  const { styles } = useStyles(loginStyles);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useMessage();
  const dispatch = useAppDispatch();

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

  const handleLogin = async () => {
    setLoading(true);

    await axiosInstance
      .post("login", { email, password })
      .then((response) => {
        const token = response?.data?.token;
        const userId = response?.data?.userId;

        if (token) {
          setAccessToken(token);
          setUserId(userId);
          dispatch(setUser({email} as any));
          resetAndNavigate("UserBottomTab");
          showSuccess("Login successful!");
        } else {
          console.log("Token not found in response");
          setLoading(false);
          showError("Login failed: Token not found in response.");
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
        {/* <CustomText fontFamily="Okra-Bold" variant="h2" style={styles.title}>
          Vietnam&apos;s #1 Food Delivery and Dining App
        </CustomText> */}

        <BreakerText text="Log in" />

        <Input value={email} title="Email" onChangeText={setEmail} />
        <Input value={password} title="Password" onChangeText={setPassword} />
        <TouchableOpacity
          onPress={() => navigate("ForgotPassScreen")}
          style={{ alignSelf: "flex-end", marginVertical: 8 }}
        >
          <CustomText color="blue" fontFamily="Okra-Medium" variant="h6">
            Forgot password?
          </CustomText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonContainer}
          disabled={loading}
          onPress={handleLogin}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <CustomText color="#fff" fontFamily="Okra-Medium" variant="h5">
              Login
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

export default LoginScreen;
