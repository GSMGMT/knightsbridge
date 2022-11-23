import { v4 as uuidv4 } from 'uuid';

import { PresaleAsset } from '@contracts/presale/nft/PresaleOrder';

import { User } from '@contracts/User';
import { firestore } from '@libs/firebase/admin-config';
import { FirebaseCollections } from '@libs/firebase/collections';
import { PresaleOrderConverter } from '@libs/firebase/converters/presale/nft/presaleOrderConverter';
import { OmitTimestamp } from '@utils/types';

interface InsertOrder {
  nft: PresaleAsset;
  user: OmitTimestamp<User>;
  amount: number;
  fee: number;
}
const insertNFTPresaleOrder = async (newOrder: InsertOrder) => {
  const uid = uuidv4();
  const serverTime = firestore.FieldValue.serverTimestamp();

  const OrderDoc = firestore()
    .collection(FirebaseCollections.NFT_PRESALE_ORDERS)
    .doc(uid)
    .withConverter(PresaleOrderConverter);

  await OrderDoc.create({
    uid,
    ...newOrder,
    createdAt: serverTime,
    updatedAt: serverTime,
  });

  return (await OrderDoc.get()).data();
};
export default insertNFTPresaleOrder;
