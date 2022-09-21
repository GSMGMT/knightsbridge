import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

import { firestore } from '@libs/firebase/config';
import { FirebaseCollections } from '@libs/firebase/collections';
import { CryptoDepositConverter } from '@libs/firebase/converters/cryptoDepositConverter';
import { OmitTimestamp } from '@utils/types';
import { User } from '@contracts/User';
import { CryptoCurrency, CRYPTODepositStatus } from '@contracts/CryptoDeposit';
import { Address } from '@contracts/Addres';

interface InsertDeposit {
  amount: number;
  transactionHash: string;
  address: OmitTimestamp<Address>;
  currency: CryptoCurrency;
  user: Omit<User, 'role'>;
}

const insertDeposit = async (newDeposit: InsertDeposit) => {
  const uid = uuidv4();
  const serverTime = serverTimestamp();

  const DepositDoc = doc(
    firestore,
    FirebaseCollections.CRYPTO_DEPOSITS,
    uid
  ).withConverter(CryptoDepositConverter);

  await setDoc(DepositDoc, {
    uid,
    ...newDeposit,
    status: CRYPTODepositStatus.PROCESSING,
    createdAt: serverTime,
    updatedAt: serverTime,
  });

  const insertedDeposit = await getDoc(DepositDoc);

  return insertedDeposit.data();
};

export default insertDeposit;
