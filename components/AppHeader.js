import React from 'react';
import {Image, StyleSheet, TouchableHighlight} from 'react-native';
import {Header} from 'react-native-elements';
import {Icon} from 'react-native-elements';
import * as RootNavigation from '../RootNavigation';

const AppHeader = () => {
  return (
    <>
      <Header
        containerStyle={{backgroundColor: 'white'}}
        leftComponent={<Icon name="menu" color="#cb0e28" size={28} />}
        centerComponent={
          <TouchableHighlight>
            <Image
              source={require('../images/americas_mart_logo.png')}
              resizeMode="contain"
              style={{height: 40}}
            />
          </TouchableHighlight>
        }
        rightComponent={
          <Icon
            name="shopping-cart"
            color="#cb0e28"
            onPress={() => RootNavigation.navigate('ShoppingCart', {})}
            size={28}
          />
        }
      />
    </>
  );
};

const HeaderStyles = StyleSheet.create({
  title: {
    fontFamily: 'Roboto',
  },
});

export default AppHeader;
