import MessageContainer from "@/components/global/MessageContainer";
import "@/unistyles/unistyles"; // initialize Unistyles themes
import { navigationRef } from "@/utils/NavigationUtils";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./states/store";

// Screens
import LoginScreen from "@/app/auth/LoginScreen";
import SplashScreen from "@/app/auth/SplashScreen";
import CheckoutScreen from "@/app/checkout/CheckoutScreen";
import CheckPayment from "@/app/checkout/CheckPayment";
import OrderSuccessScreen from "@/app/checkout/OrderSuccessScreen";
import RestaurantScreen from "@/app/restaurants/RestaurantScreen";
import AnimatedTab from "@/app/tabs/AnimatedTab";
import ChangePasswordScreen from "./app/auth/ChangePasswordScreen";
import ForgotPassScreen from "./app/auth/ForgotPassScreen";
import SignupScreen from "./app/auth/SignupScreen";
import MessageExampleScreen from "./app/examples/MessageExampleScreen";
import OrderDetailScreen from "./app/profile/OrderDetailScreen";
import OrderHistoryScreen from "./app/profile/OrderHistoryScreen";

const Stack = createNativeStackNavigator();

const linking = {
  prefixes: ["foodies://"],
  config: {
    screens: {
      SplashScreen: "splash",
      LoginScreen: "login",
      UserBottomTab: "home",
      RestaurantScreen: "restaurant/:id?",
      CheckoutScreen: "checkout",
      CheckPayment: "checkout/CheckPayment",
      OrderSuccessScreen: "order/success",
    },
  },
};

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer ref={navigationRef} linking={linking}>
          <Stack.Navigator
            initialRouteName="SplashScreen"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="SplashScreen" component={SplashScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen
              name="ForgotPassScreen"
              component={ForgotPassScreen}
            />
            <Stack.Screen
              name="ChangePasswordScreen"
              component={ChangePasswordScreen}
            />
            <Stack.Screen
              name="OrderHistoryScreen"
              component={OrderHistoryScreen}
            />
            <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
            <Stack.Screen name="SignupScreen" component={SignupScreen} />
            <Stack.Screen name="UserBottomTab" component={AnimatedTab} />
            <Stack.Screen
              name="RestaurantScreen"
              component={RestaurantScreen}
            />
            <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
            <Stack.Screen name="CheckPayment" component={CheckPayment} />
            <Stack.Screen
              name="MessageExampleScreen"
              component={MessageExampleScreen}
            />
            <Stack.Screen
              name="OrderSuccessScreen"
              component={OrderSuccessScreen}
            />
          </Stack.Navigator>
          <MessageContainer />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
