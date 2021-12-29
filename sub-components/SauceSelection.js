import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {RadioButton} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from './Button';

const SauceSelection = ({
  sauceSelections,
  sauceOptions,
  updateSauceSelections,
  toggleSauceModal,
}) => {
  // useEffect(() => {}, [sauceSelections]);

  const sauceSelected = selection => {
    if (sauceSelections.length >= 2) {
      return;
    } else {
      updateSauceSelections(prevList => [...prevList, selection]);
    }
  };

  const deselectSauce = (selection, selectedIndex) => {
    // const itemToDelete = sauceSelections.findIndex(
    //   element => element == selection,
    // );

    const newList = sauceSelections.filter(
      (sauce, index) => index !== selectedIndex,
    );

    updateSauceSelections(newList);
  };
  return (
    <View style={styles.container}>
      <View style={styles.modal}>
        <Ionicons
          name="close-circle"
          color="white"
          size={30}
          style={{position: 'absolute', top: -30, right: -30}}
          onPress={() => toggleSauceModal(false)}
        />
        <Text style={{fontFamily: 'bebasneue', fontSize: 25, color: 'white'}}>
          Chooose any two sauces{' '}
        </Text>
        <View
          style={{
            borderBottomColor: 'white',
            borderBottomWidth: 2,
            width: 250,
            marginBottom: 10,
          }}></View>
        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              borderRadius: 8,
              marginRight: 2,
            }}>
            {sauceOptions.map((sauce, index) => (
              <Button
                onPress={() => sauceSelected(sauce)}
                key={index}
                styles={{
                  height: 30,
                  width: 90,
                  borderWidth: 2,
                  borderColor: 'white',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5,
                  marginBottom: 5,
                }}>
                <Text
                  style={{
                    fontFamily: 'bebasneue',
                    color: 'white',
                    fontSize: 15,
                  }}>
                  {sauce}
                </Text>
              </Button>
            ))}
          </View>
          <View
            style={{
              flex: 1,
              marginLeft: 2,
            }}>
            {sauceSelections
              ? sauceSelections.map((selection, index) => (
                  <Button
                    onPress={() => deselectSauce(selection, index)}
                    key={index}
                    styles={{
                      height: 30,
                      width: 90,
                      backgroundColor: 'white',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 5,
                      marginBottom: 5,
                    }}>
                    <Text
                      style={{
                        fontFamily: 'bebasneue',
                        color: '#cb0e28',
                        fontSize: 15,
                      }}>
                      {selection}
                    </Text>
                  </Button>
                ))
              : null}
          </View>
        </View>
        <Button
          onPress={() => toggleSauceModal(false)}
          styles={{
            width: 200,
            height: 40,
            backgroundColor: 'white',
            position: 'absolute',
            bottom: 5,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{fontFamily: 'bebasneue', fontSize: 20, color: 'green'}}>
            Confirm
          </Text>
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    height: 250,
    width: 250,
    backgroundColor: '#cb0e28',
    alignItems: 'center',
    borderRadius: 8,
    opacity: 1,
    padding: 5,
  },
  sauceOptions: {
    height: 40,
    width: 100,
    backgroundColor: 'red',
  },
  selectedSauce: {
    height: 40,
    width: 100,
    backgroundColor: 'blue',
  },
});

export default SauceSelection;
