import React, {useState, useEffect} from 'react';
import Button from '../sub-components/Button';
import {Alert} from 'react-native';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const HomeScreen = ({navigation}) => {
  const [categories, updateCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      const temp = await firestore().collection('menuCategories').get();
      const tempArray = [];
      temp.forEach(item => {
        const data = item.data();
        if (data.isActive == true) {
          tempArray.push(item.data());
        }
      });
      updateCategories(tempArray);
    };
    fetchCategories();
  }, []);

  return (
    <View style={mainStyles.background}>
      {categories.map((item, index) => (
        <Button
          key={index}
          onPress={() =>
            navigation.navigate('EntreeList', {menuCategory: item.title})
          }
          title={item.title}
          styles={{
            backgroundColor: 'white',
            marginTop: 10,
            maxHeight: 80,
            flexGrow: 1,
            width: 300,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{fontFamily: 'BebasNeue', fontSize: 22, color: '#cb0e28'}}>
            {item.title}
          </Text>
        </Button>
      ))}
    </View>
  );
};

const mainStyles = StyleSheet.create({
  background: {
    // backgroundColor: '#ffffff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  iconContainer1: {
    marginTop: 10,
    shadowColor: 'black',
    shadowOffset: {width: 5, height: 5},
    shadowOpacity: 0.5,
    width: 300,
  },
  iconContainer2: {
    shadowColor: 'black',
    shadowOffset: {width: 5, height: 5},
    shadowOpacity: 0.5,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 300,
  },
  iconContainer3: {
    shadowColor: 'black',
    shadowOffset: {width: 5, height: 5},
    shadowOpacity: 0.5,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 300,
  },
  iconContainer4: {
    width: 145,
  },
  iconContainer5: {
    width: 145,
  },
  icon: {
    width: 300,
    height: 120,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  miniIcon: {
    shadowColor: 'black',
    shadowOffset: {width: 5, height: 5},
    width: 144,
    height: 120,
    // marginRight: 10,
  },
  longIcon: {
    height: 250,
  },
  iconText: {
    color: '#ffffff',
    fontSize: 40,
  },
  marginTop: {
    marginTop: 10,
  },
});

export default HomeScreen;
