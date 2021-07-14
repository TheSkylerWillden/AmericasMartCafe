import 'react-native-gesture-handler';
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {NavigationContainer, StackActions} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './components/HomeScreen';
import EntreeList from './components/EntreeList';
import EntreeDetails from './components/EntreeDetails';
import Checkout from './components/Checkout';
import AppHeader from './components/AppHeader';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const Stack = createStackNavigator();

const App = ({navigation}) => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppHeader navigation={navigation} />
        <Stack.Navigator
          screenOptions={{
            headerStatusBarHeight: 0,
            headerStyle: {
              backgroundColor: '#cb0e28',
            },
            headerBackTitleVisible: false,
            headerTitleStyle: {
              color: 'white',
              fontFamily: 'BebasNeue',
              fontSize: 22,
            },
            headerTintColor: 'white',
          }}>
          <Stack.Screen name="Home" component={HomeScreen}></Stack.Screen>
          <Stack.Screen name="EntreeList" component={EntreeList}></Stack.Screen>
          <Stack.Screen
            name="EntreeDetails"
            component={EntreeDetails}></Stack.Screen>
          <Stack.Screen name="Checkout" component={Checkout}></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const mainStyles = {
  background: {
    backgroundColor: '#cb0e28',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  items: {
    margin: 10,
    height: 100,
    width: 300,
    border: 'solid',
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default App;
