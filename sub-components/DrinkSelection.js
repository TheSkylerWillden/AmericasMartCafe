import React, {useState, useRef, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Button from './Button';
import Ionicons from 'react-native-vector-icons/Ionicons';

const DrinkSelection = ({
  drinkSelection,
  drinkOptions,
  updateDrinkSelection,
}) => {
  // const [selectedDrink, updateSelectedDrink] = useState();
  const drinkStyle = DrinkSelectionStyles.buttons;
  const activeDrinkStyle = DrinkSelectionStyles.activeDrink;

  const selectDrink = newSelection => {
    if (newSelection == drinkSelection) {
      updateDrinkSelection(null);
    } else {
      updateDrinkSelection(newSelection);
    }
  };

  return (
    <View style={DrinkSelectionStyles.buttonGroup}>
      {drinkOptions.map((drinkSize, index) => (
        <Button
          onPress={() => selectDrink(drinkSize)}
          styles={
            drinkSelection == drinkSize
              ? {
                  height: 25,
                  width: 60,
                  backgroundColor: 'white',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 8,
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
            {drinkSize.size}
          </Text>
          {drinkSelection == drinkSize ? (
            <Ionicons
              style={{position: 'absolute', right: -8, top: -7, color: 'green'}}
              size={21}
              name="checkmark-circle"
            />
          ) : null}
        </Button>
        // <TouchableOpacity
        //   key={index}
        //   onPress={() => selectDrink(drinkSize)}
        //   style={drinkSelection == drinkSize ? activeDrinkStyle : drinkStyle}>
        //   <Text>{drinkSize.size} </Text>
        // </TouchableOpacity>
      ))}
    </View>
  );
};

const DrinkSelectionStyles = StyleSheet.create({
  buttonGroup: {
    flexDirection: 'row',
  },
  activeDrink: {
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

export default DrinkSelection;
