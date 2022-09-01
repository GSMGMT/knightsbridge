import {
  doc,
  FieldValue,
  getDoc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';

import { firestore } from '@libs/firebase/config';
import { FirebaseCollections } from '@libs/firebase/collections';
import { Asset } from '@contracts/Wallet';
import { AssetConverter } from '@libs/firebase/converters/assetConverter';

type UpdateFields = Partial<Omit<Asset, 'createdAt' | 'uid' | 'amount'>> & {
  amount?: FieldValue;
};

const updateAsset = async (
  walletUid: string,
  assetUid: string,
  fieldsToUpdate: UpdateFields
) => {
  const serverTime = serverTimestamp();

  const AssetDoc = doc(
    firestore,
    FirebaseCollections.WALLETS,
    walletUid,
    FirebaseCollections.ASSETS,
    assetUid
  ).withConverter(AssetConverter);

  await updateDoc(AssetDoc, {
    ...fieldsToUpdate,
    updatedAt: serverTime,
  });

  const updatedAsset = await getDoc(AssetDoc);

  return updatedAsset.data();
};

export default updateAsset;
