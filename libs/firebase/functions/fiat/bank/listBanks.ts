import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  QueryConstraint,
} from 'firebase/firestore';

import { FirebaseCollections } from '@libs/firebase/collections';
import { firestore } from '@libs/firebase/config';
import { BankConverter } from '@libs/firebase/converters/bankConverter';
import { Bank } from '@contracts/Bank';
import { Sort } from '@utils/types';

interface ListBanks {
  size: number;
  sort: Sort[];
}

const listBanks = async ({ size, sort }: ListBanks): Promise<Bank[]> => {
  const BankCollection = collection(
    firestore,
    FirebaseCollections.BANK
  ).withConverter(BankConverter);

  const queryConstraints: QueryConstraint[] = [limit(size)];

  if (sort?.length) {
    queryConstraints.unshift(
      ...sort.map(({ field, orientation }) => orderBy(field, orientation))
    );
  } else {
    queryConstraints.unshift(orderBy('createdAt'));
  }

  const q = query(BankCollection, ...queryConstraints);

  const querySnapshot = await getDocs(q);

  const banks: Bank[] = [];

  querySnapshot.forEach((doc) => banks.push(doc.data()));

  return banks;
};

export default listBanks;
