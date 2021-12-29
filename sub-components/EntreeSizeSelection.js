import React, {useState, useRef, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Button from '../sub-components/Button';
import Ionicons from 'react-native-vector-icons/Ionicons';

const EntreeSizeSelection = ({
  availableSizes,
  sizeSelection,
  updateSizeSelection,
}) => {
  useEffect(() => {});

  const selectSize = newSelection => {
    updateSizeSelection(newSelection);
  };

  return (
    <View style={styles.buttonGroup}>
      {availableSizes.map((size, index) => (
        <Button
          onPress={() => selectSize(size)}
          styles={
            size == sizeSelection
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
                  marginLeft: 8,
                }
          }
          key={index}>
          <Text
            style={{
              fontFamily: 'bebasneue',
              fontSize: 16,
              color: '#cb0e28',
            }}>
            {size.size}
          </Text>
          {size == sizeSelection ? (
            <Ionicons
              style={{position: 'absolute', right: -8, top: -7, color: 'green'}}
              size={21}
              name="checkmark-circle"
            />
          ) : null}
        </Button>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonGroup: {
    flexDirection: 'row',
    // marginBottom: 5,
  },
});

export default EntreeSizeSelection;
