import { StockPair } from '@contracts/StockPair';
import { firestore, Query } from '@libs/firebase/admin-config';
import { FirebaseCollections } from '@libs/firebase/collections';
import { StockPairConverter } from '@libs/firebase/converters/stockPairConverter';
import { Sort } from '@utils/types';

interface ListStockPairs {
  size: number;
  sort?: Sort;
  filters: {
    name?: string;
    onlyEnabled?: boolean;
  };
}

const listStockPairs = async ({ size, sort, filters }: ListStockPairs) => {
  let StockPairQuery = firestore()
    .collection(FirebaseCollections.STOCK_PAIRS)
    .withConverter(StockPairConverter) as Query<StockPair>;

  if (filters.name) {
    StockPairQuery = StockPairQuery.where('name', '==', filters.name);
  }

  if (filters.onlyEnabled) {
    StockPairQuery = StockPairQuery.where('enabled', '==', true);
    StockPairQuery = StockPairQuery.where('history', '==', true);
  }

  StockPairQuery = StockPairQuery.orderBy(
    sort?.field ?? 'createdAt',
    sort?.orientation ?? 'asc'
  )
    .limit(size)
    .withConverter(StockPairConverter);

  const querySnapshot = await StockPairQuery.get();

  const marketPairs: StockPair[] = [];

  querySnapshot.forEach((doc) => marketPairs.push(doc.data()));

  return marketPairs;
};

export default listStockPairs;
