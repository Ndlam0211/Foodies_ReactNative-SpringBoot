import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "./auth/SplashScreen";
import LoginScreen from "./auth/LoginScreen";
import AnimatedTab from "./tabs/AnimatedTab";
import RestaurantScreen from "./restaurants/RestaurantScreen";
import CheckoutScreen from "./checkout/CheckoutScreen";
import OrderSuccessScreen from "./checkout/OrderSuccessScreen";

const Stack = createNativeStackNavigator();

export default function Index() {
  return (
    <Stack.Navigator
      initialRouteName="SplashScreen"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
      <Stack.Screen name="OrderSuccessScreen" component={OrderSuccessScreen} />
      <Stack.Screen
        name="LoginScreen"
        options={{ animation: "fade" }}
        component={LoginScreen}
      />
      <Stack.Screen
        name="RestaurantScreen"
        options={{ animation: "fade" }}
        component={RestaurantScreen}
      />
      <Stack.Screen
        name="UserBottomTab"
        options={{ animation: "fade" }}
        component={AnimatedTab}
      />
    </Stack.Navigator>
  );
}
