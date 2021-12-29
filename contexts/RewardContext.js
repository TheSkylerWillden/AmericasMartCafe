import React, {useEffect, useState, useContext} from 'react';
import {useUserContext} from './User';
import firestore from '@react-native-firebase/firestore';

const RewardContext = React.createContext();

export function useRewardContext() {
  return useContext(RewardContext);
}

const RewardContextProvider = ({children}) => {
  const [userRewards, updateUserRewards] = useState([]);
  const user = useUserContext().user;
  const userRef = user ? user.userRef : null;

  // useEffect(() => {
  //   let subscriber;

  //   // const fetchRewards = async () => {
  //   //   subscriber = await firestore()
  //   //     .collection('users')
  //   //     .doc(userRef)
  //   //     .collection('rewards')
  //   //     .onSnapshot(rewardsList => {
  //   //       if (rewardsList !== null) {
  //   //         // updateUserRewards(rewardsList.docs);
  //   //       }
  //   //     });
  //   // };
  //   // fetchRewards();

  //   return () => subscriber();
  // }, [user]);

  return (
    <RewardContext.Provider value={{userRewards, updateUserRewards}}>
      {children}
    </RewardContext.Provider>
  );
};

export default RewardContextProvider;
