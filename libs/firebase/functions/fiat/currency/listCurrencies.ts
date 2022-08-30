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
import { FiatCurrency } from '@contracts/FiatCurrency';
import { FiatCurrencyConverter } from '@libs/firebase/converters/fiatCurrencyConverter';
import { Sort } from '@utils/types';

interface ListFiatCurrencies {
  size: number;
  sort: Sort[];
}

const listFiatCurrencies = async ({
  size,
  sort,
}: ListFiatCurrencies): Promise<FiatCurrency[]> => {
  const FiatCurrencyCollection = collection(
    firestore,
    FirebaseCollections.FIAT_CURRENCIES
  ).withConverter(FiatCurrencyConverter);

  const queryConstraints: QueryConstraint[] = [limit(size)];

  if (sort?.length) {
    queryConstraints.unshift(
      ...sort.map(({ field, orientation }) => orderBy(field, orientation))
    );
  } else {
    queryConstraints.unshift(orderBy('createdAt'));
  }

  const q = query(FiatCurrencyCollection, ...queryConstraints);

  const querySnapshot = await getDocs(q);

  const fiatCurrencies: FiatCurrency[] = [];

  querySnapshot.forEach((doc) => fiatCurrencies.push(doc.data()));

  return fiatCurrencies;
};

export default listFiatCurrencies;
