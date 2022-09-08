import { MarketPair } from '@contracts/MarketPair';
import { firestore, Query } from '@libs/firebase/admin-config';
import { FirebaseCollections } from '@libs/firebase/collections';
import { MarketPairConverter } from '@libs/firebase/converters/marketPairConverter';
import { Sort } from '@utils/types';

interface ListMarketPairs {
  size: number;
  sort?: Sort;
  filters: {
    name?: string;
  };
}

const listMarketPairs = async ({ size, sort, filters }: ListMarketPairs) => {
  let MarketPairQuery = firestore()
    .collection(FirebaseCollections.MARKET_PAIRS)
    .withConverter(MarketPairConverter) as Query<MarketPair>;

  if (filters.name) {
    MarketPairQuery = MarketPairQuery.where('name', '==', filters.name);
  }

  MarketPairQuery = MarketPairQuery.orderBy(
    sort?.field ?? 'createdAt',
    sort?.orientation ?? 'asc'
  )
    .limit(size)
    .withConverter(MarketPairConverter);

  const querySnapshot = await MarketPairQuery.get();

  const marketPairs: MarketPair[] = [];

  querySnapshot.forEach((doc) => marketPairs.push(doc.data()));

  return marketPairs;
};

export default listMarketPairs;
