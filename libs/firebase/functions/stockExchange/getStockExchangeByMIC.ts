import { FirebaseCollections } from '@libs/firebase/collections';
import { firestore } from '@libs/firebase/admin-config';
import { StockExchangeConverter } from '@libs/firebase/converters/stockExchangeConverter';
import { StockExchange } from '@contracts/StockExchange';

type GetStockExchangeByMIC = (mic: string) => Promise<StockExchange | null>;
const getStockExchangeByMIC: GetStockExchangeByMIC = async (symbol) => {
  const StockExchangeCollection = firestore()
    .collection(FirebaseCollections.STOCK_EXCHANGES)
    .where('mic', '==', symbol)
    .withConverter(StockExchangeConverter);

  const querySnapshot = await StockExchangeCollection.get();

  return !querySnapshot.empty ? querySnapshot.docs[0].data() : null;
};
export default getStockExchangeByMIC;
