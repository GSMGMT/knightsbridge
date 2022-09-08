import { firestore } from '@libs/firebase/admin-config';

import { FirebaseCollections } from '@libs/firebase/collections';
import { CurrencyConverter } from '@libs/firebase/converters/currencyConverter';
import { Currency, CurrencyType } from '@contracts/Currency';
import { Sort } from '@utils/types';

interface ListCurrencies {
  size: number;
  sort?: Sort;
  filters: {
    type: CurrencyType;
  };
}

const listCurrencies = async ({
  size,
  sort,
  filters,
}: ListCurrencies): Promise<Currency[]> => {
  const CurrencyCollection = firestore()
    .collection(FirebaseCollections.CURRENCIES)
    .where('type', '==', filters.type)
    .orderBy(sort?.field ?? 'createdAt', sort?.orientation ?? 'asc')
    .limit(size)
    .withConverter(CurrencyConverter);

  const querySnapshot = await CurrencyCollection.get();

  const currencies: Currency[] = [];

  querySnapshot.forEach((doc) => currencies.push(doc.data()));

  return currencies;
};

export default listCurrencies;
