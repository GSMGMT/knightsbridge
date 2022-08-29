import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAt,
} from 'firebase/firestore';

import { FirebaseCollections } from '@libs/firebase/collections';
import { firestore } from '@libs/firebase/config';
import { BankConverter } from '@libs/firebase/converters/bankConverter';
import { Bank } from '@contracts/Bank';

const listBanks = async (
  pageNumber: number,
  pageSize: number
): Promise<Bank[]> => {
  const BankCollection = collection(
    firestore,
    FirebaseCollections.BANK
  ).withConverter(BankConverter);

  const q = query(
    BankCollection,
    orderBy('createdAt'),
    startAt((pageNumber - 1) * pageSize),
    limit(pageSize)
  );

  const querySnapshot = await getDocs(q);

  const banks: Bank[] = [];

  querySnapshot.forEach((doc) => banks.push(doc.data()));

  return banks;
};

export default listBanks;
