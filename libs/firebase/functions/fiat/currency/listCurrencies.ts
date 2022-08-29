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
import { FiatCurrency } from '@contracts/FIAT/Currency';
import { FiatCurrencyConverter } from '@libs/firebase/converters/fiatCurrencyConverter';

const listFiatCurrencies = async (
  pageNumber: number,
  pageSize: number
): Promise<FiatCurrency[]> => {
  const FiatCurrencyCollection = collection(
    firestore,
    FirebaseCollections.FIAT_CURRENCIES
  ).withConverter(FiatCurrencyConverter);

  const q = query(
    FiatCurrencyCollection,
    orderBy('createdAt'),
    startAt((pageNumber - 1) * pageSize),
    limit(pageSize)
  );

  const querySnapshot = await getDocs(q);

  const fiatCurrencies: FiatCurrency[] = [];

  querySnapshot.forEach((doc) => fiatCurrencies.push(doc.data()));

  return fiatCurrencies;
};

export default listFiatCurrencies;
