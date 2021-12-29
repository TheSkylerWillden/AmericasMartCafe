import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import EntreeList from './EntreeList';
import EntreeDetails from './EntreeDetails';

const Stack = createStackNavigator();

const MenuTab = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        // headerStatusBarHeight: 0,
        headerStyle: {
          backgroundColor: '#cb0e28',
          // height: 70,
        },
        headerBackTitleVisible: false,
        headerTitleStyle: {
          color: 'white',
          fontFamily: 'BebasNeue',
          fontSize: 22,
        },
        headerTintColor: 'white',
      }}>
      <Stack.Screen
        name="Home"
        options={{title: 'Menu'}}
        component={HomeScreen}></Stack.Screen>
      <Stack.Screen
        name="EntreeList"
        options={({route}) => ({title: route.params.menuCategory})}
        component={EntreeList}></Stack.Screen>
      <Stack.Screen
        name="EntreeDetails"
        component={EntreeDetails}
        options={({route}) => ({
          title: route.params.cartItem
            ? route.params.cartItem.entreeData.title
            : route.params.entreeData.title,
        })}></Stack.Screen>
    </Stack.Navigator>
  );
};
export default MenuTab;
