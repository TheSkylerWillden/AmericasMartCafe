import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from './Button';

const Customization = ({
  toggleCustomModal,
  customizationOptions,
  updateCustomizations,
  customizations,
}) => {
  const selectCustomization = (customization, index) => {
    if (customizations !== null) {
      if (customizations.includes(customization) == true) return;
    }

    updateCustomizations(prevList => [...prevList, customization]);
  };

  const deselectCustomization = selectedIndex => {
    const newList = customizations.filter(
      (customization, index) => index !== selectedIndex,
    );
    updateCustomizations(newList);
  };

  return (
    <View style={styles.container}>
      <View style={styles.modal}>
        <Ionicons
          name="close-circle"
          color="white"
          size={30}
          style={{position: 'absolute', top: -30, right: -30}}
          onPress={() => toggleCustomModal(false)}
        />
        <Text style={{fontFamily: 'bebasneue', fontSize: 25, color: 'white'}}>
          Customizations
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
            {customizationOptions.map((customization, index) => (
              <Button
                onPress={() => selectCustomization(customization, index)}
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
                  {customization}
                </Text>
              </Button>
            ))}
          </View>
          <View
            style={{
              flex: 1,
              marginLeft: 2,
            }}>
            {customizations
              ? customizations.map((customization, index) => {
                  return (
                    <Button
                      onPress={() => deselectCustomization(index)}
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
                        {customization}
                      </Text>
                    </Button>
                  );
                })
              : null}
          </View>
        </View>
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
    height: 300,
    width: 250,
    backgroundColor: '#cb0e28',
    alignItems: 'center',
    borderRadius: 8,
    opacity: 1,
  },
});

export default Customization;
