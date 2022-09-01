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
import { CurrencyConverter } from '@libs/firebase/converters/currencyConverter';
import { Currency, CurrencyType } from '@contracts/Currency';
import { Sort } from '@utils/types';

interface ListCurrencies {
  size: number;
  sort?: Sort[];
  filters?: {
    type?: CurrencyType;
  };
}

const listCurrencies = async ({
  size,
  sort,
  filters,
}: ListCurrencies): Promise<Currency[]> => {
  const CurrencyCollection = collection(
    firestore,
    FirebaseCollections.CURRENCIES
  ).withConverter(CurrencyConverter);

  const queryConstraints: QueryConstraint[] = [limit(size)];

  if (sort?.length) {
    queryConstraints.unshift(
      ...sort.map(({ field, orientation }) => orderBy(field, orientation))
    );
  } else {
    queryConstraints.unshift(orderBy('createdAt'));
  }

  if (filters?.type) {
    queryConstraints.push(where('type', '==', filters.type));
  }

  const q = query(CurrencyCollection, ...queryConstraints);

  const querySnapshot = await getDocs(q);

  const currencies: Currency[] = [];

  querySnapshot.forEach((doc) => currencies.push(doc.data()));

  return currencies;
};

export default listCurrencies;
