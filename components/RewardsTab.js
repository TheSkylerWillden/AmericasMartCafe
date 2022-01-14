import React, {useEffect} from 'react';
import {View, Text, Image} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import Rewards from './Rewards';
import RewardEntreeDetails from '../sub-components/RewardEntreeDetails';

const Stack = createStackNavigator();

const RewardsTab = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        //  Upper left hand Americas Mart Logo
        headerTitle: () => (
          <Image
            source={require('../images/americas_mart_logo.png')}
            style={{height: 60, width: 130, marginBottom: -40}}
          />
        ),
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
        name="Rewards"
        // options={{
        //   headerTitle: () => (
        //     <Image
        //       source={require('../images/americas_mart_logo.png')}
        //       style={{height: 60, width: 130, marginBottom: -40}}
        //     />
        //   ),
        // }}
        component={Rewards}></Stack.Screen>
      <Stack.Screen
        name="RewardEntreeDetails"
        component={RewardEntreeDetails}></Stack.Screen>
    </Stack.Navigator>
  );
};
export default RewardsTab;
