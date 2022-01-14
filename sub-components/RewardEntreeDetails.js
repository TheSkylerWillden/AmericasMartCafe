import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Modal} from 'react-native';
import {useCartContext} from '../contexts/Cart';
import {CartItem} from '../models/CartItem';
import DrinkSelection from '../sub-components/DrinkSelection';
import Customization from '../sub-components/Customization';
import EntreeSizeSelection from '../sub-components/EntreeSizeSelection';
import FriesSelection from '../sub-components/FriesSelection';
import SauceSelection from '../sub-components/SauceSelection';
import {useMenuContext} from '../contexts/Menu';
import Button from '../sub-components/Button';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import {useRewardContext} from '../contexts/RewardContext';

const RewardEntreeDetails = ({route, navigation}) => {
  const currentEntree = route.params.cartItem
    ? route.params.cartItem.entreeData
    : route.params.entreeData;

  //if editItem is not null, this item came from the cart.
  const editItem = route.params.cartItem ? route.params.cartItem : null;

  const rewardData = route.params.cartItem
    ? route.params.cartItem.rewardData
    : route.params.rewardData;

  const [drinkSelection, updateDrinkSelection] = useState();

  const [friesSelection, updateFriesSelection] = useState();
  const [sizeSelection, updateSizeSelection] = useState(
    rewardData.rewardOptions.size,
  );

  const [sauceSelections, updateSauceSelections] = useState(
    route.params.cartItem ? route.params.cartItem.sauces : [],
  );
  //*********** Customizations ************ */
  const [customizations, updateCustomizations] = useState(
    route.params.cartItem ? route.params.cartItem.customizations : [],
  );
  const [subTotal, updateSubTotal] = useState();
  const [discountSubTotal, updateDiscountSubTotal] = useState();
  const [customModalActive, toggleCustomModal] = useState(false);
  const [sauceModalActive, toggleSauceModal] = useState(false);
  const addItemToCart = useCartContext().updateCart;

  // drink and fry pricing options drawn from Menu context
  const drinkOptions = useMenuContext().menu.find(
    element => element.title == 'drinks',
  ).options.sizePrice;

  const friesOptions = useMenuContext().menu.find(
    element => element.title == 'fries',
  ).options.sizePrice;

  const sauceOptions = useMenuContext().menu.find(
    element => element.title == 'sauces',
  ).sauceOptions;

  //updating values for size, fries, and drink which are predetermined for rewards.
  useEffect(() => {
    const size = currentEntree.options.sizePrice.find(
      item => item.size === rewardData.rewardOptions.size,
    );
    updateSizeSelection(size);
    if (rewardData.rewardOptions.drink) {
      const drink = drinkOptions.find(
        item => item.size === rewardData.rewardOptions.drink,
      );
      updateDrinkSelection(drink);
    }
    if (rewardData.rewardOptions.fries) {
      const fries = friesOptions.find(
        item => item.size === rewardData.rewardOptions.fries,
      );
      updateFriesSelection(fries);
    }
  }, []);

  useEffect(() => {
    // Updates Subtotal value when state variables change.
    calculateSubTotal();
  }, [sizeSelection, drinkSelection, friesSelection]);

  const calculateSubTotal = () => {
    const rewardItemSizePrice = currentEntree.options.sizePrice.find(
      item => item.size === rewardData.rewardOptions.size,
    );

    updateSubTotal(rewardItemSizePrice.price);

    const tempSubTotal = Number(
      (
        rewardItemSizePrice.price -
        rewardItemSizePrice.price * rewardData.discount
      ).toFixed(),
    );

    updateDiscountSubTotal(tempSubTotal);
  };

  const addToCart = () => {
    if (editItem) {
      console.log('here');

      editCart();
      Toast.show({
        type: 'success',
        text1: 'Item updated',
        visibilityTime: 1750,
      });
      navigation.navigate('Rewards');
      navigation.navigate('cart');
      return;
    }
    addItemToCart(prevCart => {
      const tempItem = new CartItem(
        currentEntree,
        drinkSelection,
        friesSelection,
        sizeSelection,
        sauceSelections,
        customizations,
        discountSubTotal,
        rewardData,
      );

      const tempCart = [...prevCart, tempItem];
      return tempCart;
    });
    Toast.show({
      type: 'success',
      text1: 'Item added to cart',
      // text2: `${currentEntree.title} added to cart.`,
      visibilityTime: 1750,
    });

    navigation.navigate('Rewards');
    navigation.navigate('cart');
  };

  const editCart = () => {
    addItemToCart(prevCart => {
      const tempItem = new CartItem(
        // route.params.cartItem.index,
        currentEntree,
        drinkSelection,
        friesSelection,
        sizeSelection,
        sauceSelections,
        customizations,
        discountSubTotal,
        rewardData,
      );

      const tempCart = [...prevCart];
      tempCart[route.params.index] = tempItem;

      return tempCart;
    });
  };

  return (
    <View style={EntreeDetailsStyles.container}>
      <View style={EntreeDetailsStyles.image}></View>

      <View style={{width: 330}}>
        <Text style={{marginTop: 15}}>{currentEntree.description}</Text>
      </View>
      <View
        style={{
          borderBottomColor: '#5D5E5D',
          marginTop: 12,
          marginBottom: 12,
          borderBottomWidth: 1,
          width: 330,
        }}></View>
      <View style={{width: 330}}>
        {currentEntree.options.sizePrice.length > 1 ? (
          <View style={{flexDirection: 'row', marginBottom: 7}}>
            <View style={{flex: 1}}>
              <Text style={{fontFamily: 'bebasneue', fontSize: 22}}>
                Select a size :
              </Text>
            </View>
            <View style={{flex: 2, alignItems: 'flex-end'}}>
              <EntreeSizeSelection
                sizeSelection={sizeSelection}
                availableSizes={currentEntree.options.sizePrice}
                updateSizeSelection={() => null}
              />
            </View>
          </View>
        ) : null}
        <View style={{flexDirection: 'row', marginBottom: 7}}>
          <View style={{flex: 1}}>
            <Text style={{fontFamily: 'bebasneue', fontSize: 22}}>
              Add a drink :
            </Text>
          </View>
          <View style={{flex: 2, alignItems: 'flex-end'}}>
            <DrinkSelection
              drinkOptions={drinkOptions}
              drinkSelection={drinkSelection}
              updateDrinkSelection={() => null}
            />
          </View>
        </View>
        {currentEntree.options.friesOffered == true ? (
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1}}>
              <Text style={{fontFamily: 'bebasneue', fontSize: 22}}>
                Add Fries :
              </Text>
            </View>
            <View style={{flex: 2, alignItems: 'flex-end'}}>
              <FriesSelection
                friesOptions={friesOptions}
                friesSelection={friesSelection}
                updateFriesSelection={() => null}
              />
            </View>
          </View>
        ) : null}
      </View>
      <View
        style={{
          borderBottomColor: '#5D5E5D',
          marginTop: 12,
          marginBottom: 12,
          borderBottomWidth: 1,
          width: 330,
        }}></View>
      <View style={{width: 330, flexDirection: 'row'}}>
        {currentEntree.options.customizations.length > 0 ? (
          <Button
            styles={{
              height: 60,
              width: 80,
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 15,
            }}
            onPress={() => toggleCustomModal(true)}>
            <Text
              style={{fontFamily: 'bebasneue', fontSize: 22, color: '#cb0e28'}}>
              Customize
            </Text>
          </Button>
        ) : null}
        {currentEntree.options.saucesOffered == true ? (
          <Button
            styles={{
              height: 60,
              width: 80,
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => toggleSauceModal(true)}>
            <Text
              style={{fontFamily: 'bebasneue', fontSize: 22, color: '#cb0e28'}}>
              Sauces
            </Text>
            <Ionicons
              style={{position: 'absolute', right: -8, top: -7, color: 'grey'}}
              size={22}
              name="add-circle-sharp"
            />
          </Button>
        ) : null}
      </View>
      <View style={{marginTop: 70}}>
        <Button
          onPress={() => addToCart()}
          styles={{
            height: 50,
            width: 330,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontFamily: 'bebasneue',
              fontSize: 22,
              color: '#cb0e28',
            }}>
            Add to cart - ${(discountSubTotal / 100).toFixed(2)}
          </Text>
        </Button>
      </View>

      <Modal
        transparent={true}
        presentationStyle="overFullScreen"
        visible={customModalActive}>
        <Customization
          toggleCustomModal={toggleCustomModal}
          customizationOptions={currentEntree.options.customizations}
          updateCustomizations={updateCustomizations}
          customizations={customizations}
        />
      </Modal>
      {/* Sauce Selections  */}
      <Modal
        transparent={true}
        presentationStyle="overFullScreen"
        visible={sauceModalActive}>
        <SauceSelection
          sauceSelections={sauceSelections}
          sauceOptions={sauceOptions}
          updateSauceSelections={updateSauceSelections}
          toggleSauceModal={toggleSauceModal}
        />
      </Modal>
    </View>
  );
};

const EntreeDetailsStyles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#cb0e28',
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
    marginTop: 10,
  },
  customize: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    width: 370,
    backgroundColor: 'white',
    borderRadius: 5,
    marginTop: 10,
  },
});

export default RewardEntreeDetails;
