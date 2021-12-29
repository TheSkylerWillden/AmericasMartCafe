import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TextInput, Button} from 'react-native';
import Reward from '../sub-components/Reward';
import {useUserContext} from '../contexts/User';

const AccountDetails = ({navigation}) => {
  const googleUser = useUserContext().googleUser;
  const user = useUserContext().user;

  if (user)
    return (
      <>
        <View style={styles.main}>
          <View>
            <Text>Account Name: </Text>
            <Text>{user.name}</Text>
            <Text>{user.email}</Text>
          </View>
        </View>
      </>
    );
  else return null;
};

const styles = StyleSheet.create({
  main: {
    // flex: 1,
    justifyContent: 'center',
    marginLeft: 10,
  },
});

export default AccountDetails;
