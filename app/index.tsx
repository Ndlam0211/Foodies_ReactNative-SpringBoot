import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "./auth/SplashScreen";
import LoginScreen from "./auth/LoginScreen";

const Stack = createNativeStackNavigator();

export default function Index() {
  return (
    <Stack.Navigator 
      initialRouteName="SplashScreen"
      screenOptions={{
        headerShown:false,
      }}>
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="LoginScreen" options={{animation: 'fade'}} component={LoginScreen} />
    </Stack.Navigator>
  );
}
