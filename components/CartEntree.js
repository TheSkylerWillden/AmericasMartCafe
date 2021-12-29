import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Animated,
  TouchableOpacity,
} from 'react-native';
import {Easing} from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CartEntree = ({
  navigation,
  cartItem,
  rewardData,
  editItem,
  deleteItem,
  index,
}) => {
  const entreeData = cartItem.entreeData;
  const reward = rewardData;
  let slideValue = useRef(new Animated.Value(-26)).current;
  let textSlide = useRef(new Animated.Value(0)).current;

  const [sliderActive, updateSliderActive] = useState(false);

  // ************* animation for Side buttons
  const introSlideAnimation = Animated.timing(slideValue, {
    toValue: 2,
    easing: Easing.back(),
    duration: 250,
    useNativeDriver: false,
  });

  // ************* animation for Cart Entree Text
  const introTextSlideAnimation = Animated.timing(textSlide, {
    toValue: 27,
    easing: Easing.back(),
    duration: 250,
    useNativeDriver: false,
  });

  // ************* animation for exiting buttons
  const exitSlideAnimation = Animated.timing(slideValue, {
    toValue: -26,
    duration: 250,
    useNativeDriver: false,
  });

  // ************* animation for text returning to position
  const exitTextSlideAnimation = Animated.timing(textSlide, {
    toValue: 0,
    duration: 250,
    useNativeDriver: false,
  });

  const intro = () => {
    introSlideAnimation.start();
    introTextSlideAnimation.start();
    updateSliderActive(true);
  };
  const outro = () => {
    exitSlideAnimation.start();
    exitTextSlideAnimation.start();
    updateSliderActive(false);
  };

  return (
    <TouchableOpacity
      onPress={sliderActive ? outro : intro}
      style={{
        height: 65,
        width: 310,
        backgroundColor: 'white',
        marginTop: 10,
        flexDirection: 'row',
        shadowColor: 'black',
        shadowOffset: {width: 3, height: 3},
        shadowOpacity: 0.5,
        borderRadius: 8,
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
      <View
        style={{
          flex: 3,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}>
        <Animated.View style={{alignItems: 'center', right: textSlide}}>
          <Text style={EntreeStyles.mainTitle}>{entreeData.title}</Text>
          <Text style={EntreeStyles.description}>
            $ {(cartItem.subTotal / 100).toFixed(2)}
          </Text>
          <View style={{flexDirection: 'row'}}>
            {cartItem.fries ? (
              <Text style={{fontFamily: 'bebasneue', fontSize: 12}}>
                - fries
              </Text>
            ) : null}
            {/* Drink Section ********************** */}
            {cartItem.drink ? (
              <Text style={{fontFamily: 'bebasneue', fontSize: 12}}>
                - {cartItem.drink.size} drink
              </Text>
            ) : null}
            {/* Sauce Section ********************* */}
            {cartItem.sauces.length == 2 &&
            cartItem.sauces[0] == cartItem.sauces[1] ? (
              <Text style={{fontFamily: 'bebasneue', fontSize: 12}}>
                - {cartItem.sauces[0]} (2)
              </Text>
            ) : (
              cartItem.sauces.map((sauce, index) => (
                <Text
                  key={index}
                  style={{fontFamily: 'bebasneue', fontSize: 12}}>
                  - {sauce}
                </Text>
              ))
            )}
          </View>
        </Animated.View>
        <Animated.View style={{right: slideValue, position: 'absolute'}}>
          <Ionicons
            onPress={() => deleteItem(index)}
            name="close-circle"
            color="red"
            size={27}
          />
          <Ionicons
            onPress={() => editItem(cartItem, index)}
            name="arrow-forward-circle-sharp"
            color="grey"
            size={27}
          />
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

const EntreeStyles = StyleSheet.create({
  //   entree: {
  //     backgroundColor: 'white',
  //     width: 330,
  //     height: 90,
  //     marginTop: 10,
  //     flexDirection: 'row',
  //   },
  entreeImage: {
    height: 60,
    width: 70,
    borderRadius: 8,
  },
  body: {
    alignItems: 'center',
    flex: 1,
  },
  mainTitle: {
    paddingTop: 2,
    fontFamily: 'BebasNeue',
    fontSize: 22,
  },
  description: {
    fontSize: 15,
    marginRight: 5,
    marginLeft: 5,
    fontFamily: 'BebasNeue',
  },
});

export default CartEntree;
