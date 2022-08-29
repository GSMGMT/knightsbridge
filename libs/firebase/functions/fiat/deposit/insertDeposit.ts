import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

import { firestore } from '@libs/firebase/config';
import { FirebaseCollections } from '@libs/firebase/collections';
import { FIATDepositStatus } from '@contracts/FiatDeposit';
import { DepositConverter } from '@libs/firebase/converters/depositConverter';
import { nanoid } from 'nanoid';
import { FiatCurrency } from '@contracts/FiatCurrency';
import { Bank } from '@contracts/Bank';
import { User } from '@contracts/User';
import { OmitTimestamp } from '@utils/types';

interface InsertDeposit {
  amount: number;
  bank: OmitTimestamp<Bank>;
  currency: OmitTimestamp<FiatCurrency>;
  user: Omit<User, 'role'>;
}

const insertDeposit = async (newDeposit: InsertDeposit) => {
  const uid = uuidv4();
  const serverTime = serverTimestamp();

  const DepositDoc = doc(
    firestore,
    FirebaseCollections.DEPOSITS,
    uid
  ).withConverter(DepositConverter);

  await setDoc(DepositDoc, {
    uid,
    ...newDeposit,
    referenceNo: nanoid(10),
    status: FIATDepositStatus.PENDING,
    createdAt: serverTime,
    updatedAt: serverTime,
  });

  const insertedDeposit = await getDoc(DepositDoc);

  return insertedDeposit.data();
};

export default insertDeposit;
