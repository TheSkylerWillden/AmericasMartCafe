import React, {useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import Button from './Button';
import Ionicons from 'react-native-vector-icons/Ionicons';

const FriesSelection = ({
  friesOptions,
  friesSelection,
  updateFriesSelection,
}) => {
  const friesStyle = styles.buttons;
  const activeFriesStyle = styles.activeFriesSelection;

  const selectFries = newSelection => {
    if (newSelection == friesSelection) {
      updateFriesSelection(null);
    } else {
      updateFriesSelection(newSelection);
    }
  };

  return (
    <View style={styles.buttonGroup}>
      {friesOptions.map((element, index) => (
        <Button
          onPress={() => selectFries(element)}
          key={index}
          styles={
            friesSelection == element
              ? {
                  height: 25,
                  width: 60,
                  backgroundColor: 'white',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 5,
                }
              : {
                  height: 25,
                  width: 60,
                  backgroundColor: 'white',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 5,
                }
          }>
          <Text
            style={{
              fontFamily: 'bebasneue',
              fontSize: 16,
              color: '#cb0e28',
            }}>
            {element.size}
          </Text>
          {friesSelection == element ? (
            <Ionicons
              style={{position: 'absolute', right: -8, top: -7, color: 'green'}}
              size={21}
              name="checkmark-circle"
            />
          ) : null}
        </Button>
        // <TouchableOpacity
        //   key={index}
        //   onPress={() => selectFries(element)}
        //   style={friesSelection == element ? activeFriesStyle : friesStyle}>
        //   <Text>{element.size}</Text>
        // </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonGroup: {
    flexDirection: 'row',
  },
  activeFriesSelection: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 25,
    width: 119,
    backgroundColor: 'yellow',
    borderRadius: 5,
    marginLeft: 3,
    marginRight: 3,
  },
  buttons: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 25,
    width: 119,
    backgroundColor: 'white',
    borderRadius: 5,
    marginLeft: 3,
    marginRight: 3,
  },
});

export default FriesSelection;
