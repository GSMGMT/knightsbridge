import { doc, getDoc } from 'firebase/firestore';

import { FirebaseCollections } from '@libs/firebase/collections';
import { firestore } from '@libs/firebase/config';
import { CryptoDepositConverter } from '@libs/firebase/converters/cryptoDepositConverter';

export const getDepositByUid = async (depositUid: string) => {
  const depositRef = doc(
    firestore,
    FirebaseCollections.CRYPTO_DEPOSITS,
    depositUid
  ).withConverter(CryptoDepositConverter);
  const depositDoc = await getDoc(depositRef);
  const deposit = depositDoc.data();

  if (!deposit) {
    throw new Error(`Deposit not found`);
  }

  return deposit;
};
