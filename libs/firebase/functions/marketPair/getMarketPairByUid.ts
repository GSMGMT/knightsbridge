import { MarketPair } from '@contracts/MarketPair';
import { firestore } from '@libs/firebase/admin-config';
import { FirebaseCollections } from '@libs/firebase/collections';
import { MarketPairConverter } from '@libs/firebase/converters/marketPairConverter';

const getMarketPairByUid = async (
  uid: string
): Promise<MarketPair | undefined> => {
  const MarketPairDoc = firestore()
    .collection(FirebaseCollections.MARKET_PAIRS)
    .doc(uid)
    .withConverter(MarketPairConverter);

  const DocSnap = await MarketPairDoc.get();

  return DocSnap.data();
};

export default getMarketPairByUid;
