import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  Alert,
  TouchableOpacity,
  Modal,
} from 'react-native';
import Reward from '../sub-components/Reward';
import {useUserContext} from '../contexts/User';
import {useRewardContext} from '../contexts/RewardContext';
import firestore from '@react-native-firebase/firestore';
import Button from '../sub-components/Button';

const Rewards = ({navigation}) => {
  const [userRewards, updateUserRewards] = useState([]);
  const user = useUserContext().user;
  const userRef = user ? user.userRef : null;

  useEffect(() => {
    const subscriber = firestore()
      .collection('users')
      .doc(userRef)
      .collection('rewards')
      .onSnapshot((rewardsList, error) => {
        const tempList = [];
        rewardsList.forEach(reward => {
          tempList.push({reward: reward.data(), ref: reward.ref.id});
        });
        updateUserRewards(tempList);
      });

    return () => subscriber();
  }, [user]);

  if (user)
    return (
      <View style={styles.main}>
        <View>
          {user != null
            ? userRewards.map((reward, index) => {
                return (
                  <Reward
                    itemRef={reward.ref}
                    reward={reward.reward}
                    key={reward.ref}
                    navigation={navigation}
                  />
                );
              })
            : null}
        </View>
      </View>
    );
  else
    return (
      <View style={styles.main}>
        <Button
          onPress={() => navigation.navigate('account', {})}
          styles={{
            width: 250,
            height: 35,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontFamily: 'bebasneue', fontSize: 20}}>
            Sign in to earn Rewards.
          </Text>
        </Button>
      </View>
    );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {},
});

export default Rewards;
