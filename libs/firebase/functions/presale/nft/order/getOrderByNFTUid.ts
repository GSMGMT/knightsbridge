import { firestore } from '@libs/firebase/admin-config';
import { FirebaseCollections } from '@libs/firebase/collections';
import { PresaleOrderConverter } from '@libs/firebase/converters/presale/nft/presaleOrderConverter';

import { PresaleOrder } from '@contracts/presale/nft/PresaleOrder';

export const getOrdersByNFTUid = async (
  uid: string
): Promise<Array<PresaleOrder>> => {
  const OrderDocument = firestore()
    .collection(FirebaseCollections.NFT_PRESALE_ORDERS)
    .where('nft.uid', '==', uid)
    .withConverter(PresaleOrderConverter);

  const querySnapshot = await OrderDocument.get();

  const orders: PresaleOrder[] = [];

  querySnapshot.forEach((doc) => orders.push(doc.data()));

  return orders;
};
