import { v4 as uuidv4 } from 'uuid';

import { PresaleCoin } from '@contracts/presale/currency/PresaleCoin';

import { User } from '@contracts/User';
import { firestore } from '@libs/firebase/admin-config';
import { FirebaseCollections } from '@libs/firebase/collections';
import { PresaleOrderConverter } from '@libs/firebase/converters/presale/currency/presaleOrderConverter';
import { OmitTimestamp } from '@utils/types';

interface InsertOrder {
  amount: number;
  coin: OmitTimestamp<PresaleCoin>;
  user: OmitTimestamp<User>;
  fee: number;
}
const insertPresaleOrder = async (newOrder: InsertOrder) => {
  const uid = uuidv4();
  const serverTime = firestore.FieldValue.serverTimestamp();

  const OrderDoc = firestore()
    .collection(FirebaseCollections.PRESALE_ORDERS)
    .doc(uid)
    .withConverter(PresaleOrderConverter);

  await OrderDoc.create({
    uid,
    ...newOrder,
    createdAt: serverTime,
    updatedAt: serverTime,
  });
};
export default insertPresaleOrder;
