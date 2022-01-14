import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Modal,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useUserContext} from '../contexts/User';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import Toast from 'react-native-toast-message';
import Button from '../sub-components/Button';
import firestore from '@react-native-firebase/firestore';
import PastOrders from '../sub-components/PastOrders';

GoogleSignin.configure({
  webClientId:
    '820286851570-u759bk4d8qv13crlcnkfq7m8dn5l5cpr.apps.googleusercontent.com',
});

const Account = ({navigation}) => {
  const [pickupName, updatePickupName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, updateConfirmPassword] = useState();
  const user = useUserContext().user;
  const googleUser = useUserContext().googleUser;
  const setGoogleUser = useUserContext().setGoogleUser;
  const setUser = useUserContext().setUser;
  const [signInActive, updateSignInActive] = useState(false);
  const [pastOrdersModalActive, updatePastOrdersModalActive] = useState(false);
  const [pastOrderList, updatePastOrderList] = useState([]);

  // Fetching Past Orders for the User *****************
  useEffect(() => {
    if (user !== null && user !== undefined) {
      const temp = firestore()
        .collection('orders')
        .where('userRef', '==', user.userRef)
        .orderBy('dateTime', 'desc')
        .limit(5)
        .onSnapshot(result => {
          const tempArray = [];
          result.forEach(item => {
            tempArray.push(item.data());
          });
          updatePastOrderList(tempArray);
        });

      return () => temp();
    }
  }, [googleUser]);

  // Google Button Press *************************
  const onGoogleButtonPress = async () => {
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    await auth().signInWithCredential(googleCredential);

    const authUser = auth().currentUser;
    const response = await firestore()
      .collection('users')
      .where('uid', '==', authUser.uid)
      .get();
    if (response.docs.length == 0) {
      const newUser = await firestore().collection('users').add({
        uid: authUser.uid,
        name: authUser.displayName,
        email: authUser.email,
        stripeID: null,
      });
      setGoogleUser(prev => {
        console.log(prev);

        return {...prev._user};
      });
    }
  };

  // Create New User ***************************
  const createNewUser = () => {
    if (password.length !== 8) {
      Toast.show({
        type: 'warning',
        text1: 'Password must be at least 10 characters.',
        // text2: `${currentEntree.title} added to cart.`,
        visibilityTime: 1750,
      });
      return;
    }
    if (password != confirmPassword) {
      Toast.show({
        type: 'warning',
        text1: 'Passwords do not match!',
        // text2: `${currentEntree.title} added to cart.`,
        visibilityTime: 1750,
      });
      return;
    }
    if (pickupName == null) {
      Toast.show({
        type: 'warning',
        text1: 'Please include a name for pickups',
        // text2: `${currentEntree.title} added to cart.`,
        visibilityTime: 1750,
      });
      return;
    }
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async result => {
        // Updating Firebase Auth User with a display name. **********
        await result.user.updateProfile({displayName: pickupName});
        await result.user.reload();
        const authUser = auth().currentUser;
        const newUser = await firestore().collection('users').add({
          uid: authUser.uid,
          name: authUser.displayName,
          email: authUser.email,
          stripeID: null,
        });
        await setGoogleUser(authUser);

        Toast.show({
          type: 'success',
          text1: 'User Account created and Signed In.',
          // text2: `${currentEntree.title} added to cart.`,
          visibilityTime: 1750,
        });
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          Toast.show({
            type: 'warning',
            text1: 'That email is already in use.',
            // text2: `${currentEntree.title} added to cart.`,
            visibilityTime: 1750,
          });
        }

        if (error.code === 'auth/invalid-email') {
          Toast.show({
            type: 'warning',
            text1: 'The email address is invalid',
            // text2: `${currentEntree.title} added to cart.`,
            visibilityTime: 1750,
          });
        }

        // console.log(error);
      });
  };

  const signIn = () => {
    if (email == null) return;
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'user signed in.',
          // text2: `${currentEntree.title} added to cart.`,
          visibilityTime: 1750,
        });
        setEmail(null);
        setPassword(null);
      })
      .catch(error => {
        if (error.code === 'auth/invalid-email') {
          Toast.show({
            type: 'warning',
            text1: 'That email address is invalid.',
            // text2: `${currentEntree.title} added to cart.`,
            visibilityTime: 1750,
          });
        }
        if (error.code === 'auth/wrong-password') {
          Toast.show({
            type: 'warning',
            text1: 'Password is Incorrect',
            // text2: `${currentEntree.title} added to cart.`,
            visibilityTime: 1750,
          });
        }

        // console.error(error);
      });
  };

  const signOut = () => {
    auth()
      .signOut()
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'Signed Out',
          // text2: `${currentEntree.title} added to cart.`,
          visibilityTime: 1750,
        });
        // setUser(null);
      });
  };

  //   if (initializing) return null;
  if (googleUser) {
    return (
      <View style={accountStyles.main}>
        <View style={{flexDirection: 'row'}}>
          <Text style={{fontFamily: 'bebasneue', fontSize: 30}}>Welcome, </Text>
          <Text
            style={{fontFamily: 'bebasneue', fontSize: 30, color: '#cb0e28'}}>
            {googleUser.displayName}
          </Text>
        </View>
        {/* <AccountDetails navigation={navigation} /> */}
        <Text onPress={signOut} style={{color: 'blue', marginBottom: 15}}>
          Sign Out
        </Text>
        {/* Past Orders Button ************************************ */}
        <Button
          onPress={() => updatePastOrdersModalActive(true)}
          styles={{
            width: 250,
            height: 30,
            backgroundColor: '#cb0e28',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontFamily: 'bebasneue',
              fontSize: 20,
              color: 'white',
            }}>
            Past Orders
          </Text>
        </Button>

        <Modal transparent={true} visible={pastOrdersModalActive}>
          <PastOrders
            pastOrderList={pastOrderList}
            updatePastOrdersModalActive={updatePastOrdersModalActive}
          />
        </Modal>
      </View>
    );
  } else if (signInActive == true) {
    return (
      <View style={accountStyles.main}>
        <Text
          style={{
            fontFamily: 'bebasneue',
            fontSize: 45,
            color: '#cb0e28',
          }}>
          Sign In
        </Text>
        <TextInput
          placeholder="email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          style={{
            backgroundColor: 'white',
            // borderWidth: 1,
            padding: 5,
            borderRadius: 6,
            margin: 2,
            width: 250,
            height: 40,
            shadowColor: 'black',
            shadowOffset: {width: 3, height: 3},
            shadowOpacity: 0.5,
            marginBottom: 10,
          }}
        />
        <TextInput
          placeholder="password"
          value={password}
          onChangeText={setPassword}
          style={{
            backgroundColor: 'white',
            // borderWidth: 1,
            padding: 5,
            borderRadius: 6,
            margin: 2,
            width: 250,
            height: 40,
            shadowColor: 'black',
            shadowOffset: {width: 3, height: 3},
            shadowOpacity: 0.5,
            marginBottom: 15,
          }}
          secureTextEntry={true}
        />

        <Button
          onPress={signIn}
          styles={{
            width: 100,
            height: 35,
            backgroundColor: '#cb0e28',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 15,
          }}>
          <Text style={{fontFamily: 'bebasneue', fontSize: 20, color: 'white'}}>
            Sign In
          </Text>
        </Button>
        <Text onPress={() => updateSignInActive(false)} style={{color: 'blue'}}>
          Create Account
        </Text>

        <GoogleSigninButton
          color={GoogleSigninButton.Color.Light}
          style={{width: 250, borderRadius: 10}}
          onPress={() =>
            onGoogleButtonPress().then(() => {
              Toast.show({
                type: 'success',
                text1: 'Signed in with Google',
                // text2: `${currentEntree.title} added to cart.`,
                visibilityTime: 1750,
              });
            })
          }
        />
      </View>
    );
  } else {
    return (
      <View style={accountStyles.main}>
        <Text
          style={{
            fontFamily: 'bebasneue',
            fontSize: 45,
            color: '#cb0e28',
            marginBottom: 50,
          }}>
          Create Account
        </Text>
        <TextInput
          placeholder="pickup name"
          value={pickupName}
          onChangeText={updatePickupName}
          style={{
            backgroundColor: 'white',
            // borderWidth: 1,
            padding: 5,
            borderRadius: 6,
            margin: 2,
            width: 250,
            height: 40,
            shadowColor: 'black',
            shadowOffset: {width: 3, height: 3},
            shadowOpacity: 0.5,
            marginBottom: 7,
          }}
        />
        <TextInput
          placeholder="email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          style={{
            backgroundColor: 'white',
            // borderWidth: 1,
            padding: 5,
            borderRadius: 6,
            margin: 2,
            width: 250,
            height: 40,
            shadowColor: 'black',
            shadowOffset: {width: 3, height: 3},
            shadowOpacity: 0.5,
            marginBottom: 7,
          }}
        />
        <TextInput
          placeholder="password"
          value={password}
          onChangeText={setPassword}
          style={{
            backgroundColor: 'white',
            // borderWidth: 1,
            padding: 5,
            borderRadius: 6,
            margin: 2,
            width: 250,
            height: 40,
            shadowColor: 'black',
            shadowOffset: {width: 3, height: 3},
            shadowOpacity: 0.5,
            marginBottom: 7,
          }}
          // secureTextEntry={true}
        />
        <TextInput
          placeholder="confirm password"
          value={confirmPassword}
          onChangeText={updateConfirmPassword}
          style={{
            backgroundColor: 'white',
            // borderWidth: 1,
            padding: 5,
            borderRadius: 6,
            margin: 2,
            width: 250,
            height: 40,
            shadowColor: 'black',
            shadowOffset: {width: 3, height: 3},
            shadowOpacity: 0.5,
            marginBottom: 15,
          }}
          // secureTextEntry={true}
        />

        <Button
          onPress={createNewUser}
          styles={{
            width: 100,
            height: 35,
            backgroundColor: '#cb0e28',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 15,
          }}>
          <Text style={{fontFamily: 'bebasneue', fontSize: 20, color: 'white'}}>
            Create
          </Text>
        </Button>
        <Text>Already have an Account?</Text>
        <Text onPress={() => updateSignInActive(true)} style={{color: 'blue'}}>
          Sign In
        </Text>

        <GoogleSigninButton
          color={GoogleSigninButton.Color.Light}
          style={{width: 250, borderRadius: 10}}
          onPress={() =>
            onGoogleButtonPress().then(() => {
              Toast.show({
                type: 'success',
                text1: 'Signed in with Google',
                // text2: `${currentEntree.title} added to cart.`,
                visibilityTime: 1750,
              });
            })
          }
        />
      </View>
    );
  }
};

const accountStyles = {
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default Account;
