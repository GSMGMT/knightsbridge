import { Currency } from '@contracts/Currency';
import { firestore } from '@libs/firebase/admin-config';
import { FirebaseCollections } from '@libs/firebase/collections';
import { CurrencyConverter } from '@libs/firebase/converters/currencyConverter';

const getCurrencyBySymbol = async (
  symbol: string
): Promise<Currency | null> => {
  const CurrencyCollection = firestore()
    .collection(FirebaseCollections.CURRENCIES)
    .where('symbol', '==', symbol)
    .withConverter(CurrencyConverter);

  const querySnapshot = await CurrencyCollection.get();

  return !querySnapshot.empty ? querySnapshot.docs[0].data() : null;
};

export default getCurrencyBySymbol;
