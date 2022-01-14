import React, {useState} from 'react';
import {ScrollView, View, Text, StyleSheet} from 'react-native';
import Button from '../sub-components/Button';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';

const PastOrders = ({updatePastOrdersModalActive, pastOrderList}) => {
  return (
    <View style={styles.container}>
      <View style={styles.modal}>
        <Ionicons
          onPress={() => updatePastOrdersModalActive(false)}
          name="close-circle"
          size={30}
          style={{position: 'absolute', top: -30, right: -20}}
        />
        <Text
          style={{
            fontFamily: 'bebasneue',
            fontSize: 25,
            color: 'white',
            marginBottom: 10,
          }}>
          Past Orders
        </Text>
        <ScrollView
          bounces={false}
          style={{paddingRight: 12, left: 5, paddingTop: 7}}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{alignItems: 'center'}}>
          {pastOrderList.map((item, index) => (
            <PastOrder key={index} item={item} />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default PastOrders;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modal: {
    height: 400,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    opacity: 1,
  },
});

// ******************* Past Order ***********************

const PastOrder = ({item}) => {
  const [orderSelected, updateOrderSelected] = useState(false);
  const formattedDate = item.dateTime.toDate().toLocaleDateString();
  const formattedTime = item.dateTime
    .toDate()
    .toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});

  if (orderSelected == false) {
    return (
      <Button
        onPress={() => updateOrderSelected(true)}
        styles={{
          width: 300,
          height: 50,
          backgroundColor: 'white',
          justifyContent: 'center',
          marginBottom: 10,
        }}>
        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              // borderWidth: 1,
              flex: 3,
            }}>
            <Text
              style={{fontFamily: 'bebasneue', fontSize: 16, color: '#cb0e28'}}>
              {formattedDate}
            </Text>

            <Text
              style={{fontFamily: 'bebasneue', fontSize: 14, color: '#cb0e28'}}>
              {formattedTime}
            </Text>
          </View>
          <View
            style={{flex: 8, alignItems: 'center', justifyContent: 'center'}}>
            <View
              style={{
                // flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{fontFamily: 'bebasneue'}}>
                {item.orderList[0].title} ...
              </Text>
              <Text style={{fontFamily: 'roboto', fontSize: 11}}>
                {item.orderList.length} items
              </Text>
            </View>
          </View>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <Ionicons
              size={20}
              color={item.orderFulfilled == true ? 'green' : 'grey'}
              name={'checkmark-circle'}
            />
          </View>
        </View>
      </Button>
    );
  } else {
    return (
      <Button
        onPress={() => updateOrderSelected(false)}
        styles={{
          width: 300,
          //   height: 300,
          backgroundColor: 'white',
          padding: 5,
          marginBottom: 10,
        }}>
        <View style={{flexDirection: 'row', marginBottom: 10}}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              // borderWidth: 1,
              flex: 3,
            }}>
            <Text
              style={{fontFamily: 'bebasneue', fontSize: 16, color: '#cb0e28'}}>
              {item.date}
            </Text>
          </View>
          {/* Keep empty view to maintain flex spacing */}
          <View style={{flex: 8, alignItems: 'center'}}></View>
          <View style={{flex: 1}}>
            <Ionicons
              size={20}
              color={item.orderFulfilled == true ? 'green' : 'grey'}
              name={'checkmark-circle'}
            />
          </View>
        </View>
        {item.orderList.map((orderItem, index) => {
          return (
            <View key={index} style={{marginBottom: 10}}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{fontFamily: 'bebasneue', fontSize: 14}}>
                  {orderItem.size} {orderItem.title}
                </Text>
                {orderItem.itemReward !== undefined ? (
                  <Text
                    style={{
                      fontFamily: 'bebasneue',
                      color: 'green',
                    }}>
                    Reward Item
                  </Text>
                ) : null}
              </View>

              {orderItem.drink !== 'none' ? (
                <Text style={{fontFamily: 'roboto', fontSize: 11}}>
                  {orderItem.drink} drink
                </Text>
              ) : null}

              {orderItem.fries !== 'none' ? (
                <Text style={{fontFamily: 'roboto', fontSize: 11}}>
                  {orderItem.drink} fries
                </Text>
              ) : null}

              <View
                style={{
                  borderBottomWidth: 1,
                  borderColor: 'grey',
                  width: 290,
                  marginTop: 5,
                }}></View>
            </View>
          );
        })}
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: 290,
            flexDirection: 'row',
          }}>
          <Text style={{fontFamily: 'bebasneue', fontSize: 18}}>Total : </Text>
          <Text style={{fontFamily: 'bebasneue', fontSize: 18}}>
            $ {(item.total / 100).toFixed(2)}
          </Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text
            style={{
              fontFamily: 'bebasneue',
              fontSize: 12,
            }}>
            PickUp Time :
          </Text>
          <Text
            style={{
              fontFamily: 'bebasneue',
              fontSize: 12,
              color: 'green',
            }}>
            {' '}
            {item.pickUpTime}
          </Text>
        </View>
      </Button>
    );
  }
};
