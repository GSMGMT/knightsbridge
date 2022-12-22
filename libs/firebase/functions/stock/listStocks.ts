import { firestore } from '@libs/firebase/admin-config';

import { FirebaseCollections } from '@libs/firebase/collections';
import { StockConverter } from '@libs/firebase/converters/stockConverter';
import { Stock } from '@contracts/Stock';
import { Sort } from '@utils/types';

interface ListCurrencies {
  size?: number;
  sort?: Sort;
  filters?: {
    symbol?: string;
  };
}

const listStocks: (data?: ListCurrencies) => Promise<Stock[]> = async ({
  size = 1000,
  filters,
  sort,
} = {}) => {
  let StockCollection = firestore()
    .collection(FirebaseCollections.STOCKS)
    .orderBy(sort?.field ?? 'createdAt', sort?.orientation ?? 'asc')
    .limit(size)
    .withConverter(StockConverter);

  if (filters?.symbol) {
    StockCollection = StockCollection.where('symbol', '==', filters.symbol);
  }

  const querySnapshot = await StockCollection.get();

  const stocks: Stock[] = [];

  querySnapshot.forEach((doc) => stocks.push(doc.data()));

  return stocks;
};

export default listStocks;
