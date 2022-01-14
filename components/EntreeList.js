import React, {useEffect} from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import Entree from './Entree';
import {useMenuContext} from '../contexts/Menu';
import {TabRouter} from '@react-navigation/native';

const EntreeList = ({navigation, route}) => {
  const menu = useMenuContext().menu;
  const categorizedMenu = menu.filter(
    item => item.category == route.params.menuCategory,
  );

  return (
    <View style={EntreeListStyles.background}>
      <ScrollView contentContainerStyle={EntreeListStyles.scrollView}>
        {categorizedMenu.map((entreeData, index) => (
          <Entree
            key={index}
            navigation={navigation}
            onPress={() => navigation.navigate('EntreeDetails', {entreeData})}
            item={entreeData}
          />
        ))}
      </ScrollView>
    </View>
  );
};
const EntreeListStyles = StyleSheet.create({
  background: {
    // backgroundColor: '#cb0e28',
    flex: 1,
    justifyContent: 'center',
    paddingTop: 25,
  },
  scrollView: {
    flexGrow: 1,
    alignItems: 'center',
  },
});

export default EntreeList;
