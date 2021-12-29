import React, {useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ShoppingCart from './ShoppingCart';
import EntreeDetails from './EntreeDetails';

const Stack = createStackNavigator();

const CartTab = () => {
  const [entreeEdit, updateEntreeEdit] = useState();
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
        name="ShoppingCart"
        options={{title: 'Shopping Cart'}}
        component={ShoppingCart}
      />
      <Stack.Screen
        name="EditEntree"
        options={{title: 'Update'}}
        component={EntreeDetails}
      />
    </Stack.Navigator>
  );
};

export default CartTab;
