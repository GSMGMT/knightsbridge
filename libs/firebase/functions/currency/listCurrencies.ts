import { firestore } from '@libs/firebase/admin-config';

import { FirebaseCollections } from '@libs/firebase/collections';
import { CurrencyConverter } from '@libs/firebase/converters/currencyConverter';
import { Currency, CurrencyType } from '@contracts/Currency';
import { Sort } from '@utils/types';

interface ListCurrencies {
  size: number;
  sort?: Sort;
  filters?: {
    type?: CurrencyType;
  };
}

const listCurrencies = async ({
  size,
  sort,
  filters,
}: ListCurrencies): Promise<Currency[]> => {
  let CurrencyCollection = firestore()
    .collection(FirebaseCollections.CURRENCIES)
    .orderBy(sort?.field ?? 'createdAt', sort?.orientation ?? 'asc')
    .limit(size)
    .withConverter(CurrencyConverter);

  if (filters?.type) {
    CurrencyCollection = CurrencyCollection.where('type', '==', filters.type);
  }

  const querySnapshot = await CurrencyCollection.get();

  const currencies: Currency[] = [];

  querySnapshot.forEach((doc) => currencies.push(doc.data()));

  return currencies;
};

export default listCurrencies;
