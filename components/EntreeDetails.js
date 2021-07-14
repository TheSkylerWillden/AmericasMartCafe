import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const EntreeDetails = ({navigation}) => {
  return (
    <View style={EntreeDetailsStyles.container}>
      <View style={EntreeDetailsStyles.image}></View>
      <Text style={EntreeDetailsStyles.title}>Chicken Tender Meal</Text>
      <TouchableOpacity
        style={EntreeDetailsStyles.addToCart}
        onPress={() => console.log('hello')}>
        <Text>Add To Cart</Text>
      </TouchableOpacity>
    </View>
  );
};

const EntreeDetailsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cb0e28',
    alignItems: 'center',
  },
  image: {
    height: 200,
    width: 200,
    borderRadius: 100,
    backgroundColor: 'black',
    marginTop: 40,
  },
  title: {
    marginTop: 15,
    fontWeight: 'bold',
  },
  addToCart: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: 370,
    backgroundColor: 'white',
    borderRadius: 5,
  },
});

export default EntreeDetails;
