import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  QueryConstraint,
  where,
} from 'firebase/firestore';

import { FirebaseCollections } from '@libs/firebase/collections';
import { firestore } from '@libs/firebase/config';
import { FiatDepositConverter } from '@libs/firebase/converters/depositConverter';
import { FiatDeposit } from '@contracts/FiatDeposit';
import { Sort } from '@utils/types';

interface ListFiatDeposit {
  size: number;
  sort: Sort[];
  filters?: {
    email?: string;
    userId?: string;
  };
}

interface FieldMap {
  firstname: string;
}

const listFiatDeposits = async ({
  size,
  sort,
  filters,
}: ListFiatDeposit): Promise<FiatDeposit[]> => {
  const FiatDepositCollection = collection(
    firestore,
    FirebaseCollections.DEPOSITS
  ).withConverter(FiatDepositConverter);

  const queryConstraints: QueryConstraint[] = [limit(size)];

  if (sort?.length) {
    const fields: FieldMap = {
      firstname: 'user.name',
    };

    queryConstraints.unshift(
      ...sort.map(({ field, orientation }) =>
        orderBy(fields[field as keyof FieldMap] ?? field, orientation)
      )
    );
  } else {
    queryConstraints.unshift(orderBy('createdAt'));
  }

  if (filters?.userId) {
    queryConstraints.push(where('user.uid', '==', filters.userId));
  }

  if (filters?.email) {
    queryConstraints.push(where('user.email', '==', filters.email));
  }

  const q = query(FiatDepositCollection, ...queryConstraints);

  const querySnapshot = await getDocs(q);

  const deposits: FiatDeposit[] = [];

  querySnapshot.forEach((doc) => deposits.push(doc.data()));

  return deposits;
};

export default listFiatDeposits;
