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
    if (googleUser != null) {
      updateUser();
    }
  }, [googleUser]);

  // Handle user state changes
  function onAuthStateChanged(googleUser) {
    setGoogleUser(googleUser);
  }

  const updateUser = async () => {
    const response = await firestore()
      .collection('users')
      .where('uid', '==', googleUser.uid)
      .get();

    if (response.size == 0) {
      firestore().collection('users').add({
        uid: googleUser.uid,
        name: googleUser.displayName,
        email: googleUser.email,
        stripeID: null,
      });
    } else {
      const {uid, name, email, stripeID} = response.docs[0].data();
      const userRef = response.docs[0].ref.id;

      setUser({
        uid: uid,
        name: name,
        email: email,
        stripeID: stripeID,
        userRef: userRef,
      });
    }
  };

  return (
    <UserContext.Provider value={{googleUser, setGoogleUser, user, setUser}}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
