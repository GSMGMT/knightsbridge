import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';

import { firestore } from '@libs/firebase/config';
import { FirebaseCollections } from '@libs/firebase/collections';
import { FiatDeposit } from '@contracts/FiatDeposit';
import { FiatDepositConverter } from '@libs/firebase/converters/depositConverter';

const updateDeposit = async (
  uid: string,
  fieldsToUpdate: Partial<Omit<FiatDeposit, 'createdAt' | 'uid'>>
) => {
  const serverTime = serverTimestamp();

  const DepositDoc = doc(
    firestore,
    FirebaseCollections.DEPOSITS,
    uid
  ).withConverter(FiatDepositConverter);

  await updateDoc(DepositDoc, {
    ...fieldsToUpdate,
    updatedAt: serverTime,
  });

  const updatedDeposit = await getDoc(DepositDoc);

  return updatedDeposit.data();
};

export default updateDeposit;
