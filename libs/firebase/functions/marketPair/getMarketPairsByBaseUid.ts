import { MarketPair } from '@contracts/MarketPair';
import { firestore } from '@libs/firebase/admin-config';
import { FirebaseCollections } from '@libs/firebase/collections';
import { MarketPairConverter } from '@libs/firebase/converters/marketPairConverter';

const getMarketPairsByBaseUid = async (baseUid: string) => {
  const MarketPairCollection = firestore()
    .collection(FirebaseCollections.MARKET_PAIRS)
    .where('base.uid', '==', baseUid)
    .withConverter(MarketPairConverter);

  const querySnapshot = await MarketPairCollection.get();

  const marketPairs: MarketPair[] = [];

  querySnapshot.forEach((doc) => marketPairs.push(doc.data()));

  return marketPairs;
};

export default getMarketPairsByBaseUid;
