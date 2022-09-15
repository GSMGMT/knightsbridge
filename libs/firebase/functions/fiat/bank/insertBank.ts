import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

import { firestore } from '@libs/firebase/config';
import { FirebaseCollections } from '@libs/firebase/collections';
import { BankConverter } from '@libs/firebase/converters/bankConverter';
import { Bank } from '@contracts/Bank';

interface InsertBank {
  accountName: string;
  accountNumber: string;
  address: string;
  swiftCode: string;
  bankName: string;
  branch: string;
  bankAddress: string;
  paymentMethod: string;
}

const insertBank = async (newBank: InsertBank): Promise<Bank | undefined> => {
  const uid = uuidv4();
  const serverTime = serverTimestamp();

  const BankDoc = doc(firestore, FirebaseCollections.BANK, uid).withConverter(
    BankConverter
  );

  await setDoc(BankDoc, {
    uid,
    ...newBank,
    createdAt: serverTime,
    updatedAt: serverTime,
  });

  const insertedBank = await getDoc(BankDoc);

  return insertedBank.data();
};

export default insertBank;
