import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import Rewards from './Rewards';
import RewardEntreeDetails from '../sub-components/RewardEntreeDetails';

const Stack = createStackNavigator();

const RewardsTab = () => {
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
      <Stack.Screen name="Rewards" component={Rewards}></Stack.Screen>
      <Stack.Screen
        name="RewardEntreeDetails"
        component={RewardEntreeDetails}></Stack.Screen>
    </Stack.Navigator>
  );
};
export default RewardsTab;
