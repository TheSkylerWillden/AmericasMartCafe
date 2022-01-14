import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useMenuContext} from '../contexts/Menu';
import Button from '../sub-components/Button';
import storage from '@react-native-firebase/storage';
import FastImage from 'react-native-fast-image';

const Reward = ({reward, itemRef, navigation}) => {
  const [localRedeemedState, updateLocalRedeemedState] = useState(
    reward.isRedeemed,
  );
  const menu = useMenuContext().menu;
  const expirationDate = new Date(reward.expirationDate);

  const rewardData = {
    ...reward,
    id: itemRef,
  };

  let entreeData;
  //Finding the appropriate menu item which the reward applies to
  if (reward.rewardItem != 'total') {
    entreeData = menu.find(
      menuItem => menuItem.title === rewardData.rewardItem,
    );
  }
  const [imageRef, updateImageRef] = useState();

  const fetchImage = async () => {
    const temp = await storage()
      .ref(`/images/${entreeData.imageTitle}`)
      .getDownloadURL();

    await updateImageRef(temp);
  };

  useEffect(() => {
    fetchImage();
  }, []);

  useEffect(() => {
    updateLocalRedeemedState(rewardData.isRedeemed);
  }, []);

  const redeem = () => {
    updateLocalRedeemedState(true);
    if (entreeData) {
      navigation.navigate('RewardEntreeDetails', {entreeData, rewardData});
    } else {
      navigation.navigate('cart', {
        screen: 'ShoppingCart',
        params: {rewardData},
      });
    }
  };

  //Reward is redeemed
  if (localRedeemedState == true) {
    return (
      <Button
        styles={{
          // width: 330,
          alignSelf: 'stretch',
          height: 70,
          backgroundColor: 'white',
          marginBottom: 10,
          shadowColor: 'red',
        }}>
        {/* Shadow Box Container */}
        <View
          style={{overflow: 'hidden', flexDirection: 'row', borderRadius: 6}}>
          <View>
            <FastImage
              style={[styles.entreeImage, {backgroundColor: 'grey'}]}
              source={{
                uri: imageRef,
                // headers: { Authorization: 'someAuthToken' },
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: 260,
            }}>
            <Text
              style={{fontFamily: 'bebasneue', color: 'black', fontSize: 20}}>
              {rewardData.rewardDescription}
            </Text>
            <Text
              style={{
                fontFamily: 'roboto',
                fontSize: 10,
                color: 'red',
              }}>
              - Reward Redeemed
            </Text>
          </View>
        </View>
        {/* </View> */}
      </Button>
    );
    //Reward is expired
  } else if (expirationDate < Date.now()) {
    return (
      <Button
        styles={{
          // width: 330,
          height: 70,
          backgroundColor: 'white',
          marginBottom: 10,
          shadowColor: 'red',
        }}>
        {/* Shadow Box Container */}
        <View
          style={{overflow: 'hidden', flexDirection: 'row', borderRadius: 6}}>
          <View>
            <FastImage
              style={[styles.entreeImage, {backgroundColor: 'grey'}]}
              source={{
                uri: imageRef,
                // headers: { Authorization: 'someAuthToken' },
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: 260,
            }}>
            <Text
              style={{fontFamily: 'bebasneue', color: 'black', fontSize: 20}}>
              {rewardData.rewardDescription}
            </Text>
            <Text
              style={{
                fontFamily: 'roboto',
                fontSize: 10,
                color: 'red',
              }}>
              - Reward Expired
            </Text>
          </View>
        </View>
      </Button>
    );
    //Reward is not expired or redeemed
  } else {
    return (
      <Button
        onPress={() => {
          // updateLocalRedeemedState(true);
          // redeem();
          Alert.alert(
            'Confirm Redeem',
            'Are you sure you want to redeem this reward?',
            [
              {text: 'Cancel', style: 'cancel'},
              {text: 'Confirm', onPress: redeem},
            ],
          );
        }}
        styles={{
          // width: 330,
          height: 70,
          backgroundColor: 'white',
          marginBottom: 10,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: 'green',
        }}>
        {/* Shadow Box Container */}
        <View
          style={{overflow: 'hidden', flexDirection: 'row', borderRadius: 6}}>
          <FastImage
            style={[styles.entreeImage, {backgroundColor: 'grey'}]}
            source={{
              uri: imageRef,
              // headers: { Authorization: 'someAuthToken' },
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: 260,
            }}>
            <Text
              style={{fontFamily: 'bebasneue', color: 'black', fontSize: 20}}>
              {rewardData.rewardDescription}
            </Text>
            <Text
              style={{
                fontFamily: 'roboto',
                fontSize: 10,
                color: 'green',
              }}>
              - Redeem
            </Text>
          </View>
        </View>
      </Button>
    );
  }
};

const styles = StyleSheet.create({
  main: {
    borderColor: 'green',
    borderWidth: 2,
    borderRadius: 5,
    width: 300,
    padding: 5,
    margin: 3,
  },
  invalid: {
    borderColor: 'red',
    borderWidth: 2,
    borderRadius: 5,
    width: 300,
    padding: 5,
    margin: 3,
  },
  entreeImage: {
    height: 70,
    width: 70,
  },
});

export default Reward;
