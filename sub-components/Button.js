import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const Button = ({styles, title, children, onPress, disabled}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[buttonStyle.main, styles]}
      onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
};
const buttonStyle = StyleSheet.create({
  main: {
    shadowColor: 'black',
    shadowOffset: {width: 3, height: 3},
    shadowOpacity: 0.5,
    borderRadius: 8,
  },
});

export default Button;
