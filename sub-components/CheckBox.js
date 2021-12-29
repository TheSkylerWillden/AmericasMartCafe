import React from 'react';
import {View, Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CheckBox = () => {
  return (
    <View
      style={{
        borderWidth: 2,
        borderColor: 'green',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        borderRadius: 5,
      }}>
      <Text>ASAP: </Text>
      <Ionicons name="checkmark-circle-outline" size={22} color="green" />
    </View>
  );
};

export default CheckBox;
