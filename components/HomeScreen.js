import React, {useState} from 'react';
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
import {useEffect} from 'react/cjs/react.development';

const HomeScreen = ({navigation}) => {
  const [categories, updateCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      const temp = await firestore().collection('menuCategories').get();
      const tempArray = [];
      temp.forEach(item => tempArray.push(item.data()));
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
            height: 80,
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
      {/* <View style={mainStyles.iconContainer1}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('EntreeList', {menuCategory: 'chicken'})
          }>
          <ImageBackground
            imageStyle={{borderRadius: 10}}
            style={mainStyles.icon}
            source={require('../images/chicken_finger_meal.jpg')}>
            <Text style={mainStyles.iconText}>Chicken</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
      <View style={mainStyles.iconContainer2}>
        <TouchableOpacity onPress={() => Alert.alert('image clicked')}>
          <ImageBackground
            imageStyle={{borderRadius: 10}}
            style={mainStyles.miniIcon}
            source={require('../images/chicken_finger_meal.jpg')}>
            <Text style={mainStyles.iconText}>Pizza</Text>
          </ImageBackground>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Alert.alert('image clicked')}>
          <ImageBackground
            imageStyle={{borderRadius: 10}}
            style={mainStyles.miniIcon}
            source={require('../images/chicken_finger_meal.jpg')}>
            <Text style={mainStyles.iconText}>Breakfast</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
      <View style={mainStyles.iconContainer3}>
        <View style={mainStyles.iconContainer4}>
          <TouchableOpacity onPress={() => Alert.alert('image clicked', false)}>
            <ImageBackground
              imageStyle={{borderRadius: 10}}
              style={mainStyles.miniIcon}
              source={require('../images/chicken_finger_meal.jpg')}>
              <Text style={mainStyles.iconText}>Seafood</Text>
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Alert.prompt('Successfully added')}>
            <ImageBackground
              imageStyle={{borderRadius: 10}}
              style={[mainStyles.miniIcon, , mainStyles.marginTop]}
              source={require('../images/chicken_finger_meal.jpg')}>
              <Text style={mainStyles.iconText}>Sides</Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>
        <View style={mainStyles.iconContainer5}>
          <TouchableOpacity onPress={() => Alert.alert('image clicked')}>
            <ImageBackground
              imageStyle={{borderRadius: 10}}
              style={mainStyles.longIcon}
              source={require('../images/chicken_finger_meal.jpg')}>
              <Text style={mainStyles.iconText}>sandwiches</Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      </View>
      <View style={mainStyles.iconContainer1}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('EntreeList', {menuCategory: 'burgers'})
          }>
          <ImageBackground
            imageStyle={{borderRadius: 10}}
            style={mainStyles.icon}
            source={require('../images/chicken_finger_meal.jpg')}>
            <Text style={mainStyles.iconText}>Burgers</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

const mainStyles = StyleSheet.create({
  background: {
    // backgroundColor: '#ffffff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
