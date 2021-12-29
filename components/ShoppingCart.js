import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/core';
import Entree from './Entree';
import {useCartContext} from '../contexts/Cart';
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import {useStripe} from '@stripe/stripe-react-native';
import functions from '@react-native-firebase/functions';
import {useUserContext} from '../contexts/User';
import {OrderItem, Order} from '../models/OrderItem';
import DatePicker from 'react-native-date-picker';
//Stylized Text ***************
import SecondaryText from '../sub-components/StyledText/SecondaryText';
import CartEntree from './CartEntree';
import Button from '../sub-components/Button';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';

const ShoppingCart = ({navigation, route}) => {
  const {initPaymentSheet, presentPaymentSheet, confirmPaymentSheetPayment} =
    useStripe();
  // const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState();
  const user = useUserContext().user;
  //Stripe payment id ****************************************
  const [stripePaymentId, updateStripePaymentId] = useState();

  const cartList = useCartContext().cart;
  const updateCartList = useCartContext().updateCart;
  const [taxRate, updateTaxRate] = useState();
  const [taxTotal, updateTaxTotal] = useState();
  const [subTotal, updateSubTotal] = useState();
  const [discountSubTotal, updateDiscountSubTotal] = useState();
  const [total, updateTotal] = useState();
  const [totalReward, updateTotalReward] = useState({});
  const [payLoading, updatePayLoading] = useState(false);
  const [paymentOptionsLoading, updatePaymentOptionsLoading] = useState(false);

  //Selected pickup time
  const [pickUpTime, updatePickUpTime] = useState(new Date());
  //Earliest possible pick up time, 12 minutes passed current time.
  const [earliestPickUp, updateEarliestPickup] = useState(new Date());
  //Cafe Close time ***********************
  let tempDate = new Date();
  tempDate.setHours(19, 55);
  const [timePickerState, updateTimePickerState] = useState(false);

  //Time Selection Button Statuses ******************
  const [asapActive, updateAsapActive] = useState(false);
  const [selectActive, updateSelectActive] = useState(false);

  //Cafe Hours *********************
  const [openingTime, updateOpeningTime] = useState(new Date());
  const [closingTime, updateClosingTime] = useState(new Date());

  //Firebase Emulator
  if (__DEV__) {
    // If you are running on a physical device, replace http://localhost with the local ip of your PC. (http://192.168.x.x)
    functions().useFunctionsEmulator('http://localhost:5001');
  }

  //Retrieve Cafe OPening and closing times ******
  useEffect(() => {
    const retrieveHours = async () => {
      const temp = await firestore().collection('cafeHours').get();
      const hours = temp.docs[0].data();
      updateOpeningTime(hours.open);
      updateClosingTime(hours.close);
    };
    retrieveHours();
  }, []);

  //For reward Data **********************
  useFocusEffect(
    React.useCallback(() => {
      if (route.params) {
        updateTotalReward(route.params.rewardData);
      }
    }, [route]),
  );

  //fetching tax, calculating earliest pickup and initializing payment sheet
  useEffect(() => {
    verifyTax();
    calculateEarliestPickup();
    let temp;

    if (cartList.length > 0 && total > 0) {
      initializePaymentSheet();
    }
  }, [cartList, taxRate, totalReward, total]);

  //Fetch Tax Rate
  const fetchTaxRate = async () => {
    temp = await firestore().collection('taxRate').doc('taxRate').get();
    await updateTaxRate(temp.data().taxRate);
  };

  //Verifying if tax is already fetched
  const verifyTax = async () => {
    if (taxRate === undefined) {
      await fetchTaxRate();
    } else {
      calculateTotals();
    }
  };

  // ***** CALCULATE EARLIEST PICKUP TIME ***************
  const calculateEarliestPickup = () => {
    const currTime = new Date();
    currTime.setMinutes(currTime.getMinutes() + 5);
    const coeff = 1000 * 60 * 5;
    const roundedTime = new Date(Math.ceil(currTime.getTime() / coeff) * coeff);
    updateEarliestPickup(roundedTime);

    return roundedTime;
  };

  //********* Calculating Totals ***************************************

  const calculateTotals = () => {
    let tempSubTotal = 0;
    let tempTax = 0;
    let tempDiscountedSubTotal = 0;

    cartList.forEach(item => (tempSubTotal = item.subTotal + tempSubTotal));

    updateSubTotal(tempSubTotal);

    // on condition that there is a reward for a percentage off total price.
    if (Object.keys(totalReward).length !== 0) {
      (tempDiscountedSubTotal =
        tempSubTotal - tempSubTotal * totalReward.discount),
        updateDiscountSubTotal(tempDiscountedSubTotal);
      tempTax = taxRate * tempDiscountedSubTotal;

      updateTaxTotal(Number(tempTax.toFixed(0)));
      updateTotal(Number(tempTax + tempDiscountedSubTotal).toFixed(0));
    } else {
      tempTax = Number((taxRate * tempSubTotal).toFixed(0));
      updateTaxTotal(tempTax);
      updateTotal(tempTax + tempSubTotal);
    }
  };

  //Create Order to be sent to Firestore
  const createOrderList = cartList => {
    const orderList = [];
    cartList.forEach(cartItem => {
      orderList.push(
        new OrderItem(
          cartItem.entreeData.title,
          cartItem.size.size,
          cartItem.drink ? cartItem.drink.size : 'none',
          cartItem.fries ? cartItem.fries.size : 'none',
          cartItem.sauces,
          cartItem.customizations,
          cartItem.rewardData,
        ),
      );
    });
    return orderList;
  };

  // Stripe Checkout **************************

  const fetchPaymentSheetParams = async () => {
    if (user != null && user.stripeID != null) {
      const response = await functions().httpsCallable('ReturnCustomerPayment')(
        {
          user: user.stripeID,
          userRef: user.userRef,
          cartList: cartList,
          totalReward: totalReward,
        },
      );
      const {customer, ephemeralKey, paymentIntent, paymentIntentId} =
        response.data;
      updateStripePaymentId(paymentIntentId);
      return {
        customer,
        paymentIntent,
        ephemeralKey,
      };
    } else if (user != null) {
      const response = await functions().httpsCallable(
        'FirstTimeCustomerPayment',
      )();

      const {customer, ephemeralKey, paymentIntent} = response.data;

      //Adding Stripe ID to User in Firestore
      const newCustomer = await firestore()
        .collection('users')
        .where('uid', '==', user.uid)
        .get();

      newCustomer.docs[0].ref.update({stripeID: customer});

      return {
        customer,
        paymentIntent,
        ephemeralKey,
      };
    } else {
      const response = await functions().httpsCallable('GuestPayment')();

      const {customer, ephemeralKey, paymentIntent} = response.data;

      return {
        customer,
        paymentIntent,
        ephemeralKey,
      };
    }
  };

  //******** Payment Sheeet INitializing********** */
  const initializePaymentSheet = async () => {
    updatePaymentOptionsLoading(true);
    const {customer, ephemeralKey, paymentIntent} =
      await fetchPaymentSheetParams();

    const {error, paymentOption} = await initPaymentSheet({
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      customFlow: true,
      theme: 'night',
      merchantDisplayName: 'Americas Mart',
      applePay: true,
      merchantCountryCode: 'US',
    });
    // setLoading(false);
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    }

    updateButtons(paymentOption);
    updatePaymentOptionsLoading(false);
  };

  // ***************** UPDATING PAYMENT METHOD BUTTON ************
  const updateButtons = paymentOption => {
    if (paymentOption) {
      setPaymentMethod({
        label: paymentOption.label,
        image: paymentOption.image,
      });
    } else {
      setPaymentMethod(null);
    }
  };

  const choosePaymentOption = async () => {
    const {error, paymentOption} = await presentPaymentSheet({
      confirmPayment: false,
    });
    if (error) {
      console.log(error);
    }

    updateButtons(paymentOption);
  };

  //************PIckup Time selection confirmed */
  const pickUpTimeConfirmed = async () => {
    // Confirming that order is being placed during Cafe Hours *********
    // if (
    //   currentTime.getHours() < openingTime ||
    //   currentTime.getHours() > closingTime
    // ) {
    //   Alert.alert(
    //     'Cafe Currently Closed',
    //     `Please place your order between ${openingTime} A.M. and ${
    //       closingTime - 12
    //     } P.M.`,
    //   );
    //   return;
    // }
    if (asapActive == false && selectActive == false) {
      Toast.show({
        type: 'warning',
        text1: 'Please select a pickup time',
        visibilityTime: 1750,
      });
      return;
    } else if (pickUpTime < Date.now() && selectActive == true) {
      const newTime = calculateEarliestPickup();
      updatePickUpTime(newTime);
      Alert.alert(
        '',
        `Your pickup time has changed to ${newTime.toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
        })}
              `,
        [
          {text: 'cancel', style: 'cancel'},
          {text: 'confirm', onPress: () => onPressBuy()},
        ],
      );
    } else {
      updatePickUpTime(new Date());
      onPressBuy();
    }
  };

  //Create Food Order and confirm payment ***************
  const onPressBuy = async () => {
    const orderList = createOrderList(cartList);

    const order = new Order(
      orderList,
      stripePaymentId,
      user.userRef,
      user.name,
      user.totalReward,
      pickUpTime.toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'}),
      total,
    );
    updatePayLoading(true);

    //Checking for case where one free item is the only item in cart
    if (total > 0) {
      const {paymentIntent, error} = await confirmPaymentSheetPayment();

      if (error) {
        updatePayLoading(false);
        Alert.alert(`Error code: ${error.code}`, error.message);
        return;
      } else {
        functions()
          .httpsCallable('CreateFoodOrder')({order})
          .then(result => {
            Toast.show({
              type: 'success',
              text1: 'Your order has been confirmed!',
              visibilityTime: 2000,
            });
          })
          .catch(error => {
            console.log(error);
            Toast.show({
              type: 'warning',
              text1: 'An error has occured. Your order was unable to be placed',
              visibilityTime: 3000,
            });
          });
      }
    } else {
      // When the only cartItem is free and no Stripe payment is processed.
      functions()
        .httpsCallable('CreateFreeFoodOrder')({
          order,
        })
        .then(result => {
          Toast.show({
            type: 'success',
            text1: 'Your order has been placed!',
            visibilityTime: 2000,
          });
        })
        .catch(error => {
          console.log(error);

          Toast.show({
            type: 'warning',
            text1: 'An Error has occurred. ',
            text2: 'Your order was unable to be placed.',
            visibilityTime: 3000,
          });
        });
    }
    updatePayLoading(false);
    updateCartList([]);
    updateTotalReward({});
    updateAsapActive(false);
    updateSelectActive(false);
  };

  //********* Edit Item from cart *****************/
  const editItem = (cartItem, index) => {
    if (cartItem.rewardData) {
      navigation.navigate('RewardEntreeDetails', {cartItem, index});
    } else {
      navigation.navigate('EntreeDetails', {cartItem, index});
    }
  };

  //**********Delete Item from cart */
  const deleteItem = itemIndex => {
    const temp = cartList.filter((item, index) => index !== itemIndex);

    updateCartList(temp);
  };

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          flex: 5,
          alignItems: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            width: 330,
            borderRadius: 5,
            justifyContent: 'flex-start',
          }}>
          {cartList.map((cartItem, index) => (
            <View key={index} style={shoppingCartStyles.item}>
              <CartEntree
                index={index}
                cartItem={cartItem}
                rewardData={cartItem.rewardData}
                editItem={editItem}
                deleteItem={deleteItem}
              />
            </View>
          ))}
        </ScrollView>
      </View>
      <View
        style={{
          marginTop: 10,
          marginBottom: 30,
          alignItems: 'center',
          flex: 4,
        }}>
        {/* Cart Entree Items Begin ********************************** */}

        <Text
          style={[
            Object.keys(totalReward).length !== 0
              ? shoppingCartStyles.strikeThrough
              : null,
            {fontFamily: 'bebasneue', fontSize: 20},
          ]}>
          Subtotal: ${(subTotal / 100).toFixed(2)}
        </Text>
        {Object.keys(totalReward).length !== 0 ? (
          <Text style={shoppingCartStyles.discountSubTotal}>
            Subtotal: ${(discountSubTotal / 100).toFixed(2)}
          </Text>
        ) : null}
        <Text style={{fontFamily: 'bebasneue', fontSize: 20}}>
          Tax : ${(taxTotal / 100).toFixed(2)}
        </Text>
        <Text style={{fontFamily: 'bebasneue', fontSize: 20}}>
          Total: ${(total / 100).toFixed(2)}
        </Text>
        <View
          style={{
            borderBottomWidth: 1,
            borderColor: 'grey',
            width: 330,
            marginTop: 10,
            marginBottom: 10,
          }}></View>
        {/* Pick UP Time Section **************************** */}
        <View
          style={{
            alignItems: 'flex-start',
            width: 330,
            marginBottom: 10,
          }}>
          <Text
            style={{fontFamily: 'bebasneue', fontSize: 20, color: '#cb0e28'}}>
            Select a pickup time :
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: 330,
          }}>
          {/* ASAP Buton ***************************** */}
          <Button
            onPress={() => {
              updatePickUpTime(earliestPickUp);
              updateAsapActive(true);
              updateSelectActive(false);
            }}
            styles={{
              width: 150,
              height: 35,
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{fontFamily: 'bebasneue', fontSize: 20}}>
              Im Here!{' '}
              {/* {earliestPickUp.toLocaleTimeString([], {
                hour: 'numeric',
                minute: '2-digit',
              })} */}
            </Text>
            {asapActive ? (
              <Ionicons
                name="checkmark-circle"
                size={24}
                color="green"
                style={{position: 'absolute', top: -7, right: -7}}
              />
            ) : null}
          </Button>
          {/* Time Picker Button ************************************* */}
          <Button
            onPress={() => updateTimePickerState(prev => !prev)}
            styles={{
              width: 150,
              height: 35,
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {selectActive ? (
              <View style={{width: 150, alignItems: 'center'}}>
                <Text style={{fontFamily: 'bebasneue', fontSize: 20}}>
                  {' '}
                  Pickup :{' '}
                  {pickUpTime.toLocaleTimeString([], {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </Text>
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color="green"
                  style={{position: 'absolute', top: -11, right: -9}}
                />
              </View>
            ) : (
              <Text style={{fontFamily: 'bebasneue', fontSize: 20}}>
                select a pickup time
              </Text>
            )}
          </Button>
        </View>
        {/* Time Picker ******************** */}
        <DatePicker
          modal
          mode="time"
          minimumDate={earliestPickUp}
          maximumDate={tempDate}
          minuteInterval={5}
          open={timePickerState}
          date={pickUpTime}
          onConfirm={date => {
            updateTimePickerState(false);
            updatePickUpTime(date);
            updateSelectActive(true);
            updateAsapActive(false);
          }}
          onCancel={() => {
            updateTimePickerState(false);
          }}
        />
        <View
          style={{
            borderBottomWidth: 1,
            borderColor: 'grey',
            width: 330,
            marginTop: 17,
            marginBottom: 15,
          }}></View>

        <Button
          onPress={
            total > 0 && user !== null && paymentMethod !== undefined
              ? choosePaymentOption
              : () => {
                  if (user == null) {
                    Toast.show({
                      type: 'warning',
                      text1: 'Please sign in to place an order',
                      visibilityTime: 2000,
                    });
                    navigation.navigate('account', {});
                    return;
                  } else if (total == 0) {
                    Toast.show({
                      type: 'warning',
                      text1: 'add item to cart before selecting payment',
                      visibilityTime: 2000,
                    });
                  }
                }
          }
          styles={{
            backgroundColor: '#C3C5C7',
            width: 330,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {paymentOptionsLoading ? (
              <ActivityIndicator size="large" color="#cb0e28" />
            ) : (
              <Text
                style={{color: 'white', fontFamily: 'bebasneue', fontSize: 20}}>
                Choose Payment Option
              </Text>
            )}
            {paymentMethod !== undefined && user !== null ? (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    borderLeftWidth: 2,
                    borderLeftColor: 'grey',
                    height: 33,
                    marginLeft: 7,
                    marginRight: 7,
                  }}></View>
                {paymentMethod.label == 'Apple Pay' ? (
                  <Text style={{fontFamily: 'bebasneue', fontSize: 20}}>
                    {' '}
                    <Ionicons name="logo-apple" size={21} /> Apple Pay
                  </Text>
                ) : (
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      style={{borderRadius: 5}}
                      source={{
                        uri: `data:image/png;base64,${paymentMethod.image}`,
                      }}
                      style={{height: 25, width: 50}}
                    />
                    <Text style={{fontFamily: 'bebasneue', fontSize: 15}}>
                      {paymentMethod.label}
                    </Text>
                  </View>
                )}
              </View>
            ) : null}
          </View>
        </Button>
        <Button
          disabled={
            //Checking for possibility that single item in the cart is a free item
            cartList.length > 0 ? false : true
          }
          onPress={pickUpTimeConfirmed}
          styles={{
            height: 40,
            width: 330,
            backgroundColor: cartList.length > 0 ? '#cb0e28' : 'grey',
            marginTop: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {payLoading == true ? (
            <ActivityIndicator size="large" color="white" />
          ) : (
            <Text
              style={{color: 'white', fontFamily: 'bebasneue', fontSize: 20}}>
              Pay : ${total / 100}
            </Text>
          )}
        </Button>
      </View>
    </View>
  );
};

const shoppingCartStyles = StyleSheet.create({
  // item: {
  //   alignItems: 'center',
  //   flexDirection: 'row',
  // },
  // buttonContainer: {
  //   alignItems: 'center',
  //   marginTop: 30,
  // },
  // checkoutButton: {
  //   width: 200,
  //   height: 50,
  //   backgroundColor: 'red',
  //   borderRadius: 7,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },

  strikeThrough: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  discountSubTotal: {
    color: 'green',
    paddingLeft: 30,
    fontFamily: 'bebasneue',
    fontSize: 20,
  },
});

export default ShoppingCart;
