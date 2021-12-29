import * as functions from 'firebase-functions';
var admin = require('firebase-admin');
admin.initializeApp();
const auth = admin.auth();
const firestore = admin.firestore();
const stripe = require('stripe')(
  'sk_test_51JCwXuG52LDZDumtlaG2Mh1nYPdWOYbWkyCawV6rZIOFu40I9cJV4zJ5JkddmlcxV9dv51Wmpp4M4VtmK7oBEpCU005BLAS4FA',
  {
    apiVersion: '2020-08-27',
  },
);
//Payment for customers who do not wish to create an account
exports.GuestPayment = functions.https.onCall(async (data, context) => {
  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    {customer: customer.id},
    {apiVersion: '2020-08-27'},
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1099,
    currency: 'usd',
    customer: customer.id,
  });
  return {
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    paymentIntentId: paymentIntent.id,
  };
});
//Payment for customers who have signed in but have not placed an order previously
exports.FirstTimeCustomerPayment = functions.https.onCall(
  async (data, context) => {
    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
      {customer: customer.id},
      {apiVersion: '2020-08-27'},
    );
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1099,
      currency: 'usd',
      customer: customer.id,
    });
    return {
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      paymentIntentId: paymentIntent.id,
    };
  },
);
//Payment for return customers
exports.ReturnCustomerPayment = functions.https.onCall(
  async (data, context) => {
    const total = await calculateTotal(
      data.cartList,
      data.totalReward,
      data.userRef,
    );
    const ephemeralKey = await stripe.ephemeralKeys.create(
      {customer: data.user},
      {apiVersion: '2020-08-27'},
    );
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: 'usd',
      customer: data.user,
    });
    return {
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: data.user,
      paymentIntentId: paymentIntent.id,
    };
  },
);
//Notifications from Stripe.
exports.PaymentReceived = functions.https.onRequest(async (req, res) => {
  const event = req.body;
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      const newOrder = await firestore
        .collection('orders')
        .where('stripePaymentId', '==', paymentIntent.id)
        .get();
      //Confirming payment on firestore
      newOrder.docs[0].ref.update({paymentConfirmed: true});
      //     // Checking to see whether a total reward was redeemed
      const newOrderData = newOrder.docs[0].data();
      // if (Object.keys(newOrderData.totalReward).length !== 0) {
      if (newOrderData.totalReward !== undefined) {
        const totalReward = await firestore
          .collection('users')
          .doc(newOrderData.userRef)
          .collection('rewards')
          .doc(newOrderData.totalReward.id)
          .get();
        totalReward.ref.update({isRedeemed: true});
      }
      newOrderData.orderList.forEach(async item => {
        if (item.itemReward !== undefined) {
          const itemReward = await firestore
            .collection('users')
            .doc(newOrderData.userRef)
            .collection('rewards')
            .doc(item.itemReward.id)
            .get();
          itemReward.ref.update({isRedeemed: true});
        }
      });
  }
  res.send({received: true});
});

//Create Food Order in Firestore
exports.CreateFoodOrder = functions.https.onCall(async (data, context) => {
  firestore
    .collection('orders')
    .add(data.order)
    .then(() => {
      return;
    });
});

//Create Food Order in Firestore where the only order is a free item -- No Stripe Payment is processed
exports.CreateFreeFoodOrder = functions.https.onCall((data, context) => {
  data.order.orderList.forEach(item => {
    if (item.itemReward !== undefined) {
      firestore
        .collection('users')
        .doc(data.order.userRef)
        .collection('rewards')
        .doc(item.itemReward.id)
        .get()
        .then(result => {
          const temp = result.data();
          if (temp.isRedeemed == false && temp.expirationDate < Date.now()) {
            result.ref.update({isRedeemed: true});
            data.order.paymentConfirmed = true;
            firestore.collection('orders').add(data.order);
          }
        });
    } else {
      return;
    }
  });
});
const calculateTotal = async (cartList, totalReward, userRef) => {
  let subTotal = 0;
  let tax;
  let total;
  //Fetching Tax Rate
  const taxRateDoc = await firestore.collection('taxRate').doc('taxRate').get();
  const taxRate = taxRateDoc.data().taxRate;
  //Fetching menu
  const tempMenu = await firestore.collection('menu').get();
  const menu = [];
  tempMenu.forEach(item => menu.push(item.data()));
  //Iterating through list and calculating a subtotal
  const cartListPromise = new Promise(async (resolve, reject) => {
    await cartList.forEach(async cartItem => {
      //Ordered item is found in menu
      const selectedItem = menu.find(
        menuItem => menuItem.title === cartItem.entreeData.title,
      );
      //Correct Entree Size located
      const sizePrice = selectedItem.options.sizePrice.find(
        item => item.size === cartItem.size.size,
      );
      //If item is reward item *******************
      if (cartItem.rewardData !== undefined) {
        const reward = await firestore
          .collection('users')
          .doc(userRef)
          .collection('rewards')
          .doc(cartItem.rewardData.id)
          .get();
        const rewardData = reward.data();
        subTotal += Number(
          (sizePrice.price - sizePrice.price * rewardData.discount).toFixed(),
        );
        // Promise resolved successfully.... **********************************
        resolve('success');
      } else {
        //Entree price added to subtotal
        subTotal += sizePrice.price;
        //Total added from fries
        if (cartItem.fries != null) {
          subTotal += cartItem.fries.price;
        }
        //Total added from drink
        if (cartItem.drink != null) {
          const drinks = menu.find(menuItem => menuItem.title === 'drinks');
          const selectedDrinkSize = drinks.options.sizePrice.find(sizePrice => {
            return sizePrice.size === cartItem.drink.size;
          });
          subTotal += selectedDrinkSize.price;
        }
        resolve('success');
      }
    });
  });
  return cartListPromise.then(async () => {
    //In case of discount on percentge of total
    if (Object.keys(totalReward).length !== 0) {
      const rewardsList = await firestore
        .collection('users')
        .doc(userRef)
        .collection('rewards')
        .get();
      //Finding reward info from secure source.
      const targetedReward = rewardsList.docs.find(
        reward => reward.ref.id === totalReward.id,
      );
      //Checking to make sure reward is not expired or already redeemed
      if (
        targetedReward.data().expirationDate < Date.now() &&
        targetedReward.data().isRedeemed == false
      ) {
        //Updating subtotal to discounted subtotal.
        subTotal = Number(
          (subTotal - subTotal * totalReward.discount).toFixed(0),
        );
      }
    }
    tax = Number((taxRate * subTotal).toFixed(0));
    total = tax + subTotal;
    return total;
  });
};
//Refun Order &=*************************
exports.RefundOrder = functions.https.onCall(async (data, context) => {
  const refund = await stripe.refunds.create({
    payment_intent: data.stripePaymentId,
  });
  return refund;
});
//************** Assign Admin Status to User  **************/
exports.MakeAdmin = functions.https.onCall(async (data, context) => {
  admin
    .auth()
    .getUser(data.googleUser)
    .then(userRecord => {
      if (userRecord.customClaims['admin'] == true) {
        return auth
          .getUserByEmail(data.prospectiveAdminEmail)
          .then(userRecord2 => {
            if (userRecord2 !== null) {
              if (userRecord2.customClaims['admin'] == true) {
                return {message: 'User is already an admin.'};
              } else {
                admin.auth().setCustomUserClaims(userRecord2.uid, {
                  admin: true,
                  employee: true,
                });
                return {
                  message: 'User was successfully granted admin status.',
                };
              }
            } else {
              return {message: 'Email does not match any user.'};
            }
          })
          .catch(error => {
            return error;
          });
      } else {
        return {message: 'You are not authorized to grand Admin status.'};
      }
    })
    .catch(error => {
      return error;
    });
});
// ASsign Employee status to user ****************************************
exports.MakeEmployee = functions.https.onCall(async (data, context) => {
  return admin
    .auth()
    .getUser(data.googleUser)
    .then(userRecord => {
      if (userRecord.customClaims['admin'] == true) {
        return admin
          .auth()
          .getUserByEmail(data.prospectiveAdminEmail)
          .then(userRecord2 => {
            if (userRecord2 !== null) {
              if (userRecord2.customClaims['Employee'] == true) {
                return {message: 'User is already an Employee'};
              } else {
                admin.auth().setCustomUserClaims(userRecord2.uid, {
                  employee: true,
                });
                return {
                  message: 'User was successfully granted employee status.',
                };
              }
            } else {
              return {message: 'Email does not match any user.'};
            }
          })
          .catch(error => {
            return error;
          });
      } else {
        return {message: 'You are not authorized to grand employee status.'};
      }
    })
    .catch(error => {
      return error;
    });
});
exports.MakeMe = functions.https.onCall(async (data, context) => {
  // return auth()
  //   .getUser(data.googleUser)
  //   .then(userRecord => {
  //     if (userRecord.customClaims['admin'] !== true) {
  //       return auth()
  //         .getUserByEmail(data.prospectiveAdminEmail)
  //         .then(userRecord2 => {
  //           if (userRecord2 !== null) {
  //             if (userRecord2.customClaims['Employee'] == true) {
  //               return {message: 'User is already an Employee'};
  //             } else {
  //               auth().setCustomUserClaims(userRecord2.uid, {
  //                 employee: true,
  //               });
  //               return {
  //                 message: 'User was successfully granted employee status.',
  //               };
  //             }
  //           } else {
  //             return {message: 'Email does not match any user.'};
  //           }
  //         })
  //         .catch(error => {
  //           return error;
  //         });
  //     } else {
  //       return {message: 'You are not authorized to grand employee status.'};
  //     }
  //   })
  //   .catch(error => {
  //     return error;
  //   });
  return admin
    .auth()
    .getUser(data.googleUser)
    .then(userRecord => {
      admin.auth().setCustomUserClaims(userRecord.uid, {
        admin: true,
        employee: true,
      });
      return {message: 'custom claim set'};
    });
});
exports.QueryUsers = functions.https.onCall(async (data, context) => {
  const customUsers = await admin
    .auth()
    .listUsers()
    .then(results => {
      return results.users.filter(
        result =>
          result.customClaims.admin == true ||
          result.customClaims.employee == true,
      );
    });
  return customUsers;
});
// ****************** Revoke Permissions **********************************
exports.RevokePermissions = functions.https.onCall(async (data, context) => {
  return admin
    .auth()
    .getUser(data.googleUser)
    .then(userRecord => {
      if (userRecord.customClaims['admin'] == true) {
        return admin
          .auth()
          .getUser(data.userId)
          .then(userRecord2 => {
            if (userRecord2 !== null) {
              admin.auth().setCustomUserClaims(userRecord2.uid, {});
              return {message: 'Users Permissions successfully revoked.'};
            } else {
              return {message: 'Email does not match any user.'};
            }
          })
          .catch(error => {
            return error;
          });
      } else {
        return {message: 'You are not authorized to revoke permissions.'};
      }
    })
    .catch(error => {
      return error;
    });
});
//************************************* */ Rewards Section **********************************************************************
// Rewards Dynamic Creation when New User is Created ******************************
exports.NewUserReward = functions.firestore
  .document('users/{userId}')
  .onCreate((snap, context) => {
    functions.logger.log('Herrorooooo!');
  });
// Disseminate New Reward to Applicable Users **********************************
exports.DisseminateReward = functions.firestore
  .document('rewards/{reward}')
  .onCreate(async (snap, context) => {
    const reward = snap.data();
    const userReward = {
      discount: reward.discount,
      expirationDate: reward.expirationDate,
      rewardDescription: reward.rewardDescription,
      rewardItem: reward.rewardItem,
      rewardOptions: reward.rewardOptions,
      startDate: reward.startDate,
      isRedeemed: false,
    };
    if (reward.audience == 'everyone') {
      const users = await firestore.collection('users').get();
      users.forEach(user => {
        user.ref.collection('rewards').add(userReward);
      });
    } else if (reward.audience == 'single') {
      const user = await firestore
        .collection('users')
        .where('uid', '==', reward.targetUser.uid)
        .get();
      user.docs[0].ref.collection('rewards').add(userReward);
    }
  });
// Create New Reward *******************************
exports.CreateReward = functions.https.onCall(async (data, context) => {
  return firestore
    .collection('rewards')
    .add({
      discount: data.discountValue,
      expirationDate: data.expirationDate,
      rewardDescription: data.rewardDescription,
      rewardItem: data.rewardItem,
      rewardOptions: data.rewardOptions,
      startDate: data.startDate,
      audience: data.audience,
      targetUser: data.targetUser,
    })
    .then(value => {
      return 'Successfully added New Reward.';
    })
    .catch(error => {
      return error;
    });
});
