import React, {useContext, useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const UserContext = React.createContext();

export function useUserContext() {
  return useContext(UserContext);
}

const UserContextProvider = ({children}) => {
  const [googleUser, setGoogleUser] = useState();
  const [user, setUser] = useState();

  useEffect(() => {
    let subscriber;
    async function fetchSubscriber() {
      subscriber = await auth().onAuthStateChanged(onAuthStateChanged);
    }
    fetchSubscriber();
    return subscriber;
  }, []);

  useEffect(() => {
    let userSub;

    if (googleUser != null && googleUser.uid != undefined) {
      firestore()
        .collection('users')
        .where('uid', '==', googleUser.uid)
        .onSnapshot(response => {
          if (response.docs.length > 0) {
            const data = response.docs[0].data();
            setUser({...data, userRef: response.docs[0].ref.id});
          }
        });
    }
    return userSub;
  }, [googleUser]);

  // Handle user state changes
  function onAuthStateChanged(googleUser) {
    setGoogleUser(googleUser);
    // updateUser(googleUser);
  }

  // const updateUser = async googleUser => {
  //   if (googleUser !== null) {
  //     const response = await firestore()
  //       .collection('users')
  //       .where('uid', '==', googleUser.uid)
  //       .get();

  //     if (response.docs.length > 0) {
  //       const {uid, name, email, stripeID} = response.docs[0].data();
  //       const userRef = response.docs[0].ref.id;

  //       setUser({
  //         uid: uid,
  //         name: name,
  //         email: email,
  //         stripeID: stripeID,
  //         userRef: userRef,
  //       });
  //     }
  //   } else {
  //     setUser(null);
  //   }
  // };

  return (
    <UserContext.Provider value={{googleUser, setGoogleUser, user, setUser}}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
