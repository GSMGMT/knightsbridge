import { FirebaseCollections } from '@libs/firebase/collections';
import { firestore } from '@libs/firebase/admin-config';
import { StockPairConverter } from '@libs/firebase/converters/stockPairConverter';
import { StockPair } from '@contracts/StockPair';

type GetStockPairByStockSymbol = (symbol: string) => Promise<StockPair | null>;
const getStockPairByStockSymbol: GetStockPairByStockSymbol = async (symbol) => {
  const StockPairCollection = firestore()
    .collection(FirebaseCollections.STOCK_PAIRS)
    .where('stock.symbol', '==', symbol)
    .withConverter(StockPairConverter);

  const querySnapshot = await StockPairCollection.get();

  return !querySnapshot.empty ? querySnapshot.docs[0].data() : null;
};
export default getStockPairByStockSymbol;
