import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

import { UserData } from '@contracts/User';
import { FirebaseCollections } from '@libs/firebase/collections';
import { firestore } from '@libs/firebase/config';
import { WalletConverter } from '@libs/firebase/converters/walletConverter';

interface InsertWallet {
  user: UserData;
}

const insertWallet = async (newWallet: InsertWallet) => {
  const uid = uuidv4();
  const serverTime = serverTimestamp();

  const WalletDoc = doc(
    firestore,
    FirebaseCollections.WALLETS,
    uid
  ).withConverter(WalletConverter);

  await setDoc(WalletDoc, {
    uid,
    ...newWallet,
    assets: [],
    createdAt: serverTime,
    updatedAt: serverTime,
  });

  const insertedWallet = await getDoc(WalletDoc);

  return insertedWallet.data();
};

export default insertWallet;
