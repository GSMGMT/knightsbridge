import { StockPair } from '@contracts/StockPair';
import { firestore } from '@libs/firebase/admin-config';
import { FirebaseCollections } from '@libs/firebase/collections';
import { StockPairConverter } from '@libs/firebase/converters/stockPairConverter';

const getStockPairsByStockUid = async (baseUid: string, enable?: boolean) => {
  const MarketPairCollection = firestore()
    .collection(FirebaseCollections.STOCK_PAIRS)
    .where('stock.uid', '==', baseUid)
    .withConverter(StockPairConverter);

  if (enable) MarketPairCollection.where('enable', '==', enable);

  const querySnapshot = await MarketPairCollection.get();

  const marketPairs: StockPair[] = [];

  querySnapshot.forEach((doc) => marketPairs.push(doc.data()));

  return marketPairs;
};

export default getStockPairsByStockUid;
