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
import { CryptoDepositConverter } from '@libs/firebase/converters/cryptoDepositConverter';
import { CryptoDeposit } from '@contracts/CryptoDeposit';
import { Sort } from '@utils/types';

interface ListCryptoDeposit {
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

const listCryptoDeposits = async ({
  size,
  sort,
  filters,
}: ListCryptoDeposit): Promise<CryptoDeposit[]> => {
  const CryptoDepositCollection = collection(
    firestore,
    FirebaseCollections.CRYPTO_DEPOSITS
  ).withConverter(CryptoDepositConverter);

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

  const q = query(CryptoDepositCollection, ...queryConstraints);

  const querySnapshot = await getDocs(q);

  const deposits: CryptoDeposit[] = [];

  querySnapshot.forEach((doc) => deposits.push(doc.data()));

  return deposits;
};

export default listCryptoDeposits;
