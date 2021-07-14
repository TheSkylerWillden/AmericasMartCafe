import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {Header} from 'react-native-elements';
import {Icon} from 'react-native-elements';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const AppHeader = ({navigation}) => {
  return (
    <>
      <Header
        containerStyle={{backgroundColor: 'white'}}
        leftComponent={<Icon name="menu" color="#cb0e28" size={28} />}
        centerComponent={
          <Image
            source={require('../images/americas_mart_logo.png')}
            resizeMode="contain"
            style={{height: 40}}
          />
        }
        rightComponent={
          <Icon
            navigation={navigation}
            name="shopping-cart"
            color="#cb0e28"
            onPress={() => navigation.navigate('Checkout', {})}
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
