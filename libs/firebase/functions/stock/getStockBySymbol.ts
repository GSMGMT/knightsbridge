import { Stock } from '@contracts/Stock';

import { FirebaseCollections } from '@libs/firebase/collections';
import { StockConverter } from '@libs/firebase/converters/stockConverter';
import { firestore } from '@libs/firebase/admin-config';

type GetStockBySymbol = (symbol: string) => Promise<Stock | null>;
const getStockBySymbol: GetStockBySymbol = async (symbol) => {
  const StockCollection = firestore()
    .collection(FirebaseCollections.STOCKS)
    .where('symbol', '==', symbol)
    .withConverter(StockConverter);

  const querySnapshot = await StockCollection.get();

  return !querySnapshot.empty ? querySnapshot.docs[0].data() : null;
};
export default getStockBySymbol;
