import { firestore } from 'firebase-admin';

import { FirebaseCollections } from '@libs/firebase/collections';
import { OrderUpdateQuery } from '@contracts/Order';
import { OrderConverter } from '@libs/firebase/converters/orderConverter';

const updateOrder = async (
  orderUid: string,
  fieldsToUpdate: OrderUpdateQuery
) => {
  const serverTime = firestore.FieldValue.serverTimestamp();

  const OrderDoc = firestore()
    .collection(FirebaseCollections.ORDERS)
    .doc(orderUid)
    .withConverter(OrderConverter);

  await firestore().runTransaction(async (transaction) => {
    transaction.update(OrderDoc, {
      ...fieldsToUpdate,
      updatedAt: serverTime,
    });
  });
};

export default updateOrder;
