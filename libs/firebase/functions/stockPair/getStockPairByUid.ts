import { FirebaseCollections } from '@libs/firebase/collections';
import { firestore } from '@libs/firebase/admin-config';
import { StockPairConverter } from '@libs/firebase/converters/stockPairConverter';
import { StockPair } from '@contracts/StockPair';

type GetStockPairByUid = (uid: string) => Promise<StockPair | null>;
const getStockPairByUid: GetStockPairByUid = async (uid) => {
  const StockPairCollection = firestore()
    .collection(FirebaseCollections.STOCK_PAIRS)
    .where('uid', '==', uid)
    .withConverter(StockPairConverter);

  const querySnapshot = await StockPairCollection.get();

  return !querySnapshot.empty ? querySnapshot.docs[0].data() : null;
};
export default getStockPairByUid;
