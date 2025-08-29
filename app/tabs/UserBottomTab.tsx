import { crudService } from "@/api/apiService";
import { loadCartsFromBackend } from "@/states/reducers/cartSlice";
import { useAppDispatch } from "@/states/reduxHook";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { FC, useEffect } from "react";
import DeliveryScreen from "../delivery/DeliveryScreen";
import LiveScreen from "../live/LiveScreen";
import ProfileScreen from "../profile/ProfileScreen";
import ReorderScreen from "../reorder/ReorderScreen";
import CustomTabBar from "./CustomTabBar";
// FloatingChatBot intentionally removed from this tab file (mounted elsewhere)

const Tab = createBottomTabNavigator();

const UserBottomTab: FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Sync cart with backend on mount
    const syncCart = async () => {
      await crudService
        .getAll({ resource: "cart" })
        .then((response) => {
          dispatch(loadCartsFromBackend(response));
        })
        .catch((error) => {
          console.error(
            "Error get cart: ",
            error.response?.data || error.message
          );
        });
    };
    syncCart();
  }, [dispatch]);

  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen name="Delivery" component={DeliveryScreen} />
      <Tab.Screen name="Reorder" component={ReorderScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Live" component={LiveScreen} />
    </Tab.Navigator>
  );
};

export default UserBottomTab;
