import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

import { firestore } from '@libs/firebase/config';

import { FirebaseCollections } from '@libs/firebase/collections';
import { CryptoDepositUpdateQuery } from '@contracts/CryptoDeposit';
import { CryptoDepositConverter } from '@libs/firebase/converters/cryptoDepositConverter';

const updateDeposit = async (
  depositUid: string,
  fieldsToUpdate: CryptoDepositUpdateQuery
) => {
  const depositRef = doc(
    firestore,
    FirebaseCollections.CRYPTO_DEPOSITS,
    depositUid
  ).withConverter(CryptoDepositConverter);
  const depositDoc = await getDoc(depositRef);
  const deposit = depositDoc.data();

  if (!deposit) {
    throw new Error(`Deposit with uid ${depositUid} not found`);
  }

  const updatedDeposit = {
    ...fieldsToUpdate,
    updatedAt: serverTimestamp(),
  };

  await setDoc(depositRef, updatedDeposit, { merge: true });
};

export default updateDeposit;
