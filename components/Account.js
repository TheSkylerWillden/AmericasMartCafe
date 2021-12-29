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
import AccountDetails from './AccountDetails';
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
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const user = useUserContext().user;
  const googleUser = useUserContext().googleUser;
  const setUser = useUserContext().setUser;
  const [signInActive, updateSignInActive] = useState(false);
  const [pastOrdersModalActive, updatePastOrdersModalActive] = useState(false);
  const [pastOrderList, updatePastOrderList] = useState([]);

  console.log(pastOrderList);

  // Fetching Past Orders for the User *****************
  useEffect(() => {
    if (googleUser !== null) {
      const temp = firestore()
        .collection('orders')
        .where('userRef', '==', user.userRef)
        .limit(5)
        .orderBy('date', 'desc')
        .orderBy('dateTime', 'desc')
        .onSnapshot(result => {
          const tempArray = [];
          result.forEach(item => {
            tempArray.push(item.data());
          });
          updatePastOrderList(tempArray);
        });

      return () => temp();
    }
  }, []);

  // Google Button Press *************************
  const onGoogleButtonPress = async () => {
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  };

  // Create New User ***************************
  const createNewUser = () => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
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

        // console.error(error);
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
        setUser(null);
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
