import { firestore } from 'firebase-admin';

import { FirebaseCollections } from '@libs/firebase/collections';
import { StockOrderUpdateQuery } from '@contracts/StockOrder';
import { StockOrderConverter } from '@libs/firebase/converters/stockOrderConverter';

const updateOrder = async (
  orderUid: string,
  fieldsToUpdate: StockOrderUpdateQuery
) => {
  const serverTime = firestore.FieldValue.serverTimestamp();

  const OrderDoc = firestore()
    .collection(FirebaseCollections.STOCK_ORDERS)
    .doc(orderUid)
    .withConverter(StockOrderConverter);

  await firestore().runTransaction(async (transaction) => {
    transaction.update(OrderDoc, {
      ...fieldsToUpdate,
      updatedAt: serverTime,
    });
  });
};

export default updateOrder;
