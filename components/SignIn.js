import React, {useState} from 'react';
import auth from '@react-native-firebase/auth';
import {View, Text, StyleSheet} from 'react-native';
// import {Input, Icon, Button} from 'react-native-elements';

const SignIn = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const createNewUser = () => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        console.log('User account created & signed in!');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      });
  };

  return (
    <View style={SignInStyles.main}>
      <Input
        onChangeText={setEmail}
        placeholder="Email"
        leftIcon={<Icon name="email" size={24} color="red" />}
      />
      <Input
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry={true}
        leftIcon={<Icon name="lock" size={24} color="red" />}
      />
      <Button title="Create Account" onPress={createNewUser} />
    </View>
  );
};

const SignInStyles = StyleSheet.create({
  main: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SignIn;
