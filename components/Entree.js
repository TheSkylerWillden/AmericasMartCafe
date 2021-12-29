import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Image, Text, TouchableHighlight} from 'react-native';
import Button from '../sub-components/Button';

const Entree = ({navigation, item, rewardData, onPress}) => {
  const entreeData = item;
  const reward = rewardData;

  return (
    <Button
      onPress={onPress}
      styles={{
        height: 75,
        width: 330,
        backgroundColor: 'white',
        marginTop: 10,
        flexDirection: 'row',
      }}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          alignItems: 'flex-start',
          paddingLeft: 5,
        }}>
        <Image
          style={EntreeStyles.entreeImage}
          source={{
            uri: 'https://firebasestorage.googleapis.com/v0/b/americascafe-1938c.appspot.com/o/sandwich.jpg?alt=media&token=ad2c6f1b-15cf-4e35-87c0-77dfeac211e1',
          }}
        />
      </View>
      <View style={{flex: 2, alignItems: 'center'}}>
        <Text style={EntreeStyles.mainTitle}>{entreeData.title}</Text>
        <Text style={EntreeStyles.description}>
          $ {entreeData.options.sizePrice[0].price / 100}
        </Text>
      </View>
    </Button>
    // <TouchableHighlight
    //   onPress={() => navigation.navigate('EntreeDetails', {entreeData})}>
    //   <View style={EntreeStyles.entree}>
    //     <Image
    //       style={EntreeStyles.entreeImage}
    //       source={{
    //         uri: 'https://firebasestorage.googleapis.com/v0/b/americascafe-1938c.appspot.com/o/sandwich.jpg?alt=media&token=ad2c6f1b-15cf-4e35-87c0-77dfeac211e1',
    //       }}
    //     />
    //     <View style={EntreeStyles.body}>
    //       <Text style={EntreeStyles.mainTitle}>{entreeData.title}</Text>
    //       <Text style={EntreeStyles.description}>$ {entreeData.subTotal}</Text>
    //     </View>
    //   </View>
    // </TouchableHighlight>
  );
};

const EntreeStyles = StyleSheet.create({
  entree: {
    backgroundColor: 'white',
    width: 300,
    height: 70,
    marginTop: 10,
    flexDirection: 'row',
  },
  entreeImage: {
    height: 70,
    width: 90,
    borderRadius: 8,
  },
  body: {
    alignItems: 'center',
    flex: 1,
  },
  mainTitle: {
    paddingTop: 2,
    fontFamily: 'BebasNeue',
    fontSize: 20,
  },
  description: {
    fontSize: 15,
    marginRight: 5,
    marginLeft: 5,
    fontFamily: 'BebasNeue',
  },
});

export default Entree;
