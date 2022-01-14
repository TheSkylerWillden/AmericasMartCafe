import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  Image,
} from 'react-native';
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
import storage from '@react-native-firebase/storage';

const EntreeDetails = ({route, navigation}) => {
  const currentEntree = route.params.cartItem
    ? route.params.cartItem.entreeData
    : route.params.entreeData;
  const editItem = route.params.cartItem ? route.params.cartItem : null;

  //Drink Selection ******************************
  const [drinkSelection, updateDrinkSelection] = useState(
    route.params.cartItem ? route.params.cartItem.drink : null,
  );
  // ********* Fries ************************
  const [friesSelection, updateFriesSelection] = useState(
    route.params.cartItem ? route.params.cartItem.fries : null,
  );

  // ********** Size ****************
  const [sizeSelection, updateSizeSelection] = useState(
    route.params.cartItem
      ? route.params.cartItem.size
      : currentEntree.options.sizePrice[0],
  );
  //************ Sauces ************ */
  const [sauceSelections, updateSauceSelections] = useState(
    route.params.cartItem ? route.params.cartItem.sauces : [],
  );

  // ************** Customizations *************
  const [customizations, updateCustomizations] = useState(
    route.params.cartItem ? route.params.cartItem.customizations : [],
  );

  const [subTotal, updateSubTotal] = useState(
    route.params.cartItem ? route.params.cartItem.subTotal : 0,
  );
  const [customModalActive, toggleCustomModal] = useState(false);
  const [sauceModalActive, toggleSauceModal] = useState(false);
  const addItemToCart = useCartContext().updateCart;

  // drink, sauce, and fry pricing options drawn from Menu context
  const drinkOptions = useMenuContext().menu.find(
    element => element.title == 'drinks',
  ).options.sizePrice;

  const friesOptions = useMenuContext().menu.find(
    element => element.title == 'fries',
  ).options.sizePrice;

  const sauceOptions = useMenuContext().menu.find(
    element => element.title == 'sauces',
  ).sauceOptions;

  const [imageRef, updateImageRef] = useState();
  const [imageLoading, updateImageLoading] = useState(true);

  useEffect(() => {
    fetchImage();
  }, []);

  useEffect(() => {
    // Updates Subtotal value when state variables change.
    calculateSubTotal();
  }, [sizeSelection, drinkSelection, friesSelection]);

  const fetchImage = async () => {
    const temp = await storage()
      .ref(`/images/${currentEntree.imageTitle}`)
      .getDownloadURL();

    await updateImageRef(temp);
  };

  const calculateSubTotal = () => {
    updateSubTotal(
      (currentEntree.options.sizePrice.length == 1
        ? currentEntree.options.sizePrice[0].price
        : sizeSelection
        ? sizeSelection.price
        : 0) +
        (drinkSelection ? drinkSelection.price : 0) +
        (friesSelection ? friesSelection.price : 0),
    );
  };

  const addToCart = () => {
    if (editItem) {
      editCart();
      Toast.show({
        type: 'success',
        text1: 'Item updated',
        // text2: `${currentEntree.title} added to cart.`,
        visibilityTime: 1750,
      });
      navigation.navigate('Home');
      navigation.navigate('cart');
      return;
    }
    addItemToCart(prevCart => {
      const tempItem = new CartItem(
        // prevCart.length,
        currentEntree,
        drinkSelection,
        friesSelection,
        sizeSelection,
        sauceSelections,
        customizations,
        subTotal,
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
    navigation.navigate('Home', {});
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
        subTotal,
      );

      const tempCart = [...prevCart];
      tempCart[route.params.index] = tempItem;

      return tempCart;
    });
  };

  return (
    <View style={EntreeDetailsStyles.container}>
      <View style={{alignItems: 'center'}}>
        <View style={EntreeDetailsStyles.image}>
          <Image
            style={{
              height: 200,
              width: 200,
              borderRadius: 100,
              backgroundColor: 'grey',
              // marginTop: 40,
            }}
            source={{
              uri: imageRef,
            }}
          />
        </View>

        <View style={{width: 330}}>
          <Text
            style={{
              fontFamily: 'bebasneue',
              fontSize: 25,
              // color: '#cb0e28',
            }}>
            {currentEntree.title}
          </Text>
          <Text style={{marginTop: 10}}>{currentEntree.description}</Text>
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
                  updateSizeSelection={updateSizeSelection}
                  availableSizes={currentEntree.options.sizePrice}
                />
              </View>
            </View>
          ) : null}
          {currentEntree.title !== 'drinks' ? (
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
                  updateDrinkSelection={updateDrinkSelection}
                />
              </View>
            </View>
          ) : null}
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
                  updateFriesSelection={updateFriesSelection}
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

        {/* ********* Customizations *************************** */}
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
                style={{
                  fontFamily: 'bebasneue',
                  fontSize: 22,
                  color: '#cb0e28',
                }}>
                Customize
              </Text>
            </Button>
          ) : null}
          {/* ********* sauces ********************************* */}
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
                style={{
                  fontFamily: 'bebasneue',
                  fontSize: 22,
                  color: '#cb0e28',
                }}>
                Sauces
              </Text>
              <Ionicons
                style={{
                  position: 'absolute',
                  right: -8,
                  top: -7,
                  color: 'grey',
                }}
                size={22}
                name="add-circle-sharp"
              />
            </Button>
          ) : null}
        </View>
      </View>
      <View style={{marginBottom: 20}}>
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
            Add to cart - ${subTotal / 100}
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
    backgroundColor: '#EDEDED',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  image: {
    height: 200,
    width: 200,
    borderRadius: 100,
    backgroundColor: 'grey',
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

export default EntreeDetails;
