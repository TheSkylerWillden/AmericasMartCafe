import React from 'react';
import {View, Text} from 'react-native';

const SecondaryText = ({children}) => {
  return (
    <View>
      <Text style={{fontFamily: 'BebasNeue', fontSize: 30, color: 'white'}}>
        {children}
      </Text>
    </View>
  );
};

export default SecondaryText;
