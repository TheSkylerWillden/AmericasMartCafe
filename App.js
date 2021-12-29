import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {Modal, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import MenuTab from './components/MenuTab';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StripeProvider} from '@stripe/stripe-react-native';
import MenuContextProvider from './contexts/Menu';
import CartContextProvider from './contexts/Cart';
import UserContextProvider from './contexts/User';
import CartTab from './components/CartTab';
import Account from './components/Account';
import RewardsTab from './components/RewardsTab';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast, {BaseToast} from 'react-native-toast-message';
import RewardContextProvider from './contexts/RewardContext';
const Tab = createBottomTabNavigator();

const toastConfig = {
  success: props => (
    <BaseToast
      {...props}
      style={{borderLeftColor: 'white'}}
      text1Style={{fontSize: 20, fontFamily: 'bebasneue', color: 'black'}}
      text2Style={{fontSize: 12, fontFamily: 'roboto', color: 'black'}}
    />
  ),
  warning: props => (
    <BaseToast
      {...props}
      style={{borderLeftColor: 'white'}}
      text1Style={{fontSize: 20, fontFamily: 'bebasneue', color: '#cb0e28'}}
      // text2Style={{fontSize: 13, fontFamily: 'roboto', color: '#cb0e28'}}
    />
  ),
};

export default function App() {
  const [alertStatus, alertStatusUpdate] = useState(false);
  return (
    <UserContextProvider>
      <RewardContextProvider>
        <CartContextProvider>
          <MenuContextProvider>
            <StripeProvider
              publishableKey="pk_test_51JCwXuG52LDZDumthDlvmCibg0HcgxF9uj3qiq4WnQjrIs99RYHdVYon4fD25XqYmZrJXEDRa2Th3bQb2EHHcjrV00mmOp0nki"
              // urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
              merchantIdentifier="merchant.AmericasMart" // required for Apple Pay
            >
              <SafeAreaProvider>
                <NavigationContainer>
                  <Tab.Navigator
                    screenOptions={({route}) => ({
                      tabBarIcon: () => {
                        let iconName;
                        if (route.name == 'menu') {
                          iconName = 'fast-food-outline';
                        } else if (route.name == 'cart') {
                          iconName = 'cart-outline';
                        } else if (route.name == 'rewards') {
                          iconName = 'gift-outline';
                        } else if (route.name == 'account') {
                          iconName = 'person-outline';
                        }
                        return (
                          <Ionicons name={iconName} size={32} color="#cb0e28" />
                        );
                      },

                      tabBarLabelStyle: {
                        fontSize: 12,
                        // color: '#cb0e28',
                        // fontFamily: 'BebasNeue',
                      },
                      tabBarStyle: {
                        // paddingBottom: 0,
                        // height: 80,
                        paddingTop: 4,
                      },
                      // tabBarInactiveBackgroundColor: '#cb0e28',
                      // tabBarInactiveBackgroundColor: 'white',
                      // tabBarActiveBackgroundColor: '#cb0e28',
                      tabBarActiveTintColor: '#cb0e28',
                      // tabBarInactiveTintColor: 'white',
                      headerShown: false,
                      // tabBarLabel: () => null,
                    })}>
                    <Tab.Screen name="menu" component={MenuTab} />
                    <Tab.Screen name="cart" component={CartTab} />
                    <Tab.Screen name="rewards" component={RewardsTab} />
                    <Tab.Screen name="account" component={Account} />
                  </Tab.Navigator>
                </NavigationContainer>
              </SafeAreaProvider>
            </StripeProvider>
          </MenuContextProvider>
        </CartContextProvider>
        <Toast config={toastConfig} />
      </RewardContextProvider>
    </UserContextProvider>
  );
}

const styles = {
  background: {
    // backgroundColor: '#cb0e28',
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
