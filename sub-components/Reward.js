import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {useMenuContext} from '../contexts/Menu';
import Button from '../sub-components/Button';

const Reward = ({reward, itemRef, navigation}) => {
  const [localRedeemedState, updateLocalRedeemedState] = useState(
    reward.isRedeemed,
  );
  const menu = useMenuContext().menu;
  // const expirationDate = reward.expirationDate.toDate();
  const expirationDate = reward.expirationDate;

  const rewardData = {
    ...reward,
    id: itemRef,
  };

  useEffect(() => {
    updateLocalRedeemedState(rewardData.isRedeemed);
  }, []);

  let entreeData;
  //Finding the appropriate menu item which the reward applies to
  if (reward.rewardItem != 'total') {
    entreeData = menu.find(
      menuItem => menuItem.title === rewardData.rewardItem,
    );
  }

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
          width: 330,
          height: 40,
          backgroundColor: 'white',
          marginBottom: 15,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: 'red',
        }}>
        <Text style={{fontFamily: 'bebasneue', color: 'black', fontSize: 20}}>
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
      </Button>
    );
    //Reward is expired
  } else if (expirationDate < Date.now()) {
    return (
      // <TouchableOpacity
      //   style={
      //     rewardData.isRedeemed == false && expirationDate > Date.now()
      //       ? styles.main
      //       : styles.invalid
      //   }>
      //   <Text>{rewardData.rewardDescription}</Text>
      //   <Text>Reward Expired</Text>
      // </TouchableOpacity>
      <Button
        styles={{
          width: 330,
          height: 40,
          backgroundColor: 'white',
          marginBottom: 15,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: 'red',
        }}>
        <Text style={{fontFamily: 'bebasneue', color: 'black', fontSize: 20}}>
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
      </Button>
    );
    //Reward is not expired or redeemed
  } else {
    return (
      // <TouchableOpacity
      //   style={
      //     rewardData.isRedeemed == false && expirationDate > Date.now()
      //       ? styles.main
      //       : styles.invalid
      //   }>
      //   <Text>{rewardData.rewardDescription}</Text>
      //   {
      //     <TouchableOpacity
      //       style={{backgroundColor: 'green'}}
      //       onPress={() => {
      //         updateLocalRedeemedState(true);
      //         redeem();
      //       }}>
      //       <Text>Redeem</Text>
      //     </TouchableOpacity>
      //   }
      // </TouchableOpacity>
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
          width: 330,
          height: 40,
          backgroundColor: 'white',
          marginBottom: 15,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: 'green',
        }}>
        <Text style={{fontFamily: 'bebasneue', color: 'black', fontSize: 20}}>
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
});

export default Reward;
