import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
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
        <View style={{flexDirection: 'row', height: 250}}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              borderRadius: 8,
              marginRight: 2,
              // overflow: 'hidden',
            }}>
            <ScrollView>
              {customizationOptions.map((customization, index) => (
                <Button
                  onPress={() => selectCustomization(customization, index)}
                  key={index}
                  styles={{
                    height: 30,
                    width: 110,
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
            </ScrollView>
          </View>
          <View
            style={{
              flex: 1,
              marginLeft: 2,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ScrollView>
              {customizations
                ? customizations.map((customization, index) => {
                    return (
                      <Button
                        onPress={() => deselectCustomization(index)}
                        key={index}
                        styles={{
                          height: 30,
                          width: 110,
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
            </ScrollView>
          </View>
        </View>
        <Button
          onPress={() => toggleCustomModal(false)}
          styles={{
            width: 290,
            height: 40,
            backgroundColor: 'white',
            position: 'absolute',
            bottom: 5,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{fontFamily: 'bebasneue', fontSize: 20}}>Confirm</Text>
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
    height: 350,
    width: 300,
    backgroundColor: '#cb0e28',
    alignItems: 'center',
    borderRadius: 8,
  },
});

export default Customization;
