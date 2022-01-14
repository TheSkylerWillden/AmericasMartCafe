import firestore from '@react-native-firebase/firestore';

export class OrderItem {
  constructor(title, size, drink, fries, sauces, customizations, itemReward) {
    this.title = title;
    this.size = size;
    this.drink = drink;
    this.fries = fries;
    this.sauces = sauces;
    this.customizations = customizations;
    this.itemReward = itemReward;
  }
}

export class Order {
  constructor(
    orderList,
    stripePaymentId,
    userRef,
    userName,
    totalReward,
    pickUpTime,
    total,
  ) {
    this.orderList = orderList;
    this.stripePaymentId = stripePaymentId;
    this.paymentConfirmed = false;
    this.userRef = userRef;
    this.userName = userName;
    this.totalReward = totalReward;
    this.pickUpTime = pickUpTime;
    this.total = total;
    this.orderFulfilled = false;
  }
}
