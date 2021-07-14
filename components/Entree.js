import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Image, Text, TouchableHighlight} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

const Entree = ({navigation}) => {
  const [state, setState] = useState('');

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {};

  return (
    <TouchableHighlight>
      <View style={EntreeStyles.entree}>
        <Image
          style={EntreeStyles.entreeImage}
          source={{
            uri: 'https://firebasestorage.googleapis.com/v0/b/americascafe-1938c.appspot.com/o/sandwich.jpg?alt=media&token=ad2c6f1b-15cf-4e35-87c0-77dfeac211e1',
          }}
        />
        <View style={EntreeStyles.body}>
          <Text style={EntreeStyles.mainTitle}>Big Western Burger</Text>
          <Text style={EntreeStyles.description}>
            1/4 lb beef patty, American Cheese, two onion rings, BBQ sauce, and
            bacon.
          </Text>
        </View>
      </View>
    </TouchableHighlight>
  );
};

const EntreeStyles = StyleSheet.create({
  entree: {
    backgroundColor: 'white',
    width: 350,
    height: 70,
    marginTop: 10,
    flexDirection: 'row',
  },
  entreeImage: {
    height: 70,
    width: 70,
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
    fontSize: 11,
    marginRight: 5,
    marginLeft: 5,
    fontFamily: 'Roboto',
  },
});

export default Entree;
