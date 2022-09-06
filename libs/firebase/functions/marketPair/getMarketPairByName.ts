import { MarketPair } from '@contracts/MarketPair';
import { firestore } from '@libs/firebase/admin-config';
import { FirebaseCollections } from '@libs/firebase/collections';
import { MarketPairConverter } from '@libs/firebase/converters/marketPairConverter';

const getMarketPairByName = async (
  marketPairName: string
): Promise<MarketPair | null> => {
  const MarketPairCollection = firestore()
    .collection(FirebaseCollections.MARKET_PAIRS)
    .where('name', '==', marketPairName)
    .withConverter(MarketPairConverter);

  const querySnapshot = await MarketPairCollection.get();

  return !querySnapshot.empty ? querySnapshot.docs[0].data() : null;
};

export default getMarketPairByName;
