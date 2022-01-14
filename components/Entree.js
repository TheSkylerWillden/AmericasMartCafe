import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Image, Text, TouchableHighlight} from 'react-native';
import Button from '../sub-components/Button';
import storage from '@react-native-firebase/storage';
import FastImage from 'react-native-fast-image';

const Entree = ({navigation, item, rewardData, onPress}) => {
  const [imageRef, updateImageRef] = useState();
  const [imageLoading, updateImageLoading] = useState(true);
  const entreeData = item;
  const reward = rewardData;

  useEffect(() => {
    fetchImage();
  }, []);

  const fetchImage = async () => {
    const temp = await storage()
      .ref(`/images/${entreeData.imageTitle}`)
      .getDownloadURL();

    await updateImageRef(temp);
  };

  return (
    <Button
      onPress={onPress}
      styles={{
        width: 330,
        backgroundColor: 'white',
        marginTop: 10,
      }}>
      {/* Shadow Box Container */}
      <View style={{overflow: 'hidden', flexDirection: 'row', borderRadius: 6}}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            alignItems: 'flex-start',
          }}>
          {/* <Image
            style={[EntreeStyles.entreeImage, {backgroundColor: 'grey'}]}
            source={{
              uri: imageRef,
            }}
          /> */}
          <FastImage
            style={[EntreeStyles.entreeImage, {backgroundColor: 'grey'}]}
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
            width: 260,
            alignSelf: 'stretch',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={EntreeStyles.mainTitle}>{entreeData.title}</Text>
          <Text style={EntreeStyles.description}>
            $ {entreeData.options.sizePrice[0].price / 100}
          </Text>
        </View>
      </View>
    </Button>
  );
};

const EntreeStyles = StyleSheet.create({
  entree: {
    backgroundColor: 'white',
    width: 300,
    height: 70,
    marginTop: 10,
    flexDirection: 'row',
  },
  entreeImage: {
    height: 70,
    width: 70,
  },
  body: {
    alignItems: 'center',
    flex: 1,
  },
  mainTitle: {
    paddingTop: 2,
    fontFamily: 'BebasNeue',
    fontSize: 20,
  },
  description: {
    fontSize: 15,
    marginRight: 5,
    marginLeft: 5,
    fontFamily: 'BebasNeue',
  },
});

export default Entree;
