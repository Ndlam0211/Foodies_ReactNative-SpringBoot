import { View, Text } from 'react-native'
import React, { FC } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import DeliveryScreen from '../delivery/DeliveryScreen';
import LiveScreen from '../live/LiveScreen';
import DiningScreen from '../dining/DiningScreen';
import ReorderScreen from '../reorder/ReorderScreen';
import CustomTabBar from './CustomTabBar';

const Tab = createBottomTabNavigator();

const UserBottomTab:FC = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props}/>}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen name='Delivery' component={DeliveryScreen} />
      <Tab.Screen name='Reorder' component={ReorderScreen} />
      <Tab.Screen name='Dining' component={DiningScreen} />
      <Tab.Screen name='Live' component={LiveScreen} />
    </Tab.Navigator>
  )
}

export default UserBottomTab