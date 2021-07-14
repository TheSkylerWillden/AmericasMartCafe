import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import Entree from './Entree';

const EntreeList = ({navigation}) => {
  return (
    <View style={EntreeListStyles.background}>
      <ScrollView contentContainerStyle={EntreeListStyles.scrollView}>
        <Entree navigation={navigation} />
        <Entree navigation={navigation} />
        <Entree navigation={navigation} />
        <Entree navigation={navigation} />
        <Entree navigation={navigation} />
        <Entree navigation={navigation} />
        <Entree navigation={navigation} />
        <Entree navigation={navigation} />
        <Entree navigation={navigation} />
        <Entree navigation={navigation} />
      </ScrollView>
    </View>
  );
};
const EntreeListStyles = StyleSheet.create({
  background: {
    backgroundColor: '#cb0e28',
    flex: 1,
    justifyContent: 'center',
  },
  scrollView: {
    flexGrow: 1,
    alignItems: 'center',
  },
});

export default EntreeList;
