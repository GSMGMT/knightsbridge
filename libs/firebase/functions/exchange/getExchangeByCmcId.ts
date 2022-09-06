import { Exchange } from '@contracts/Exchange';
import { firestore } from '@libs/firebase/admin-config';
import { FirebaseCollections } from '@libs/firebase/collections';
import { ExchangeConverter } from '@libs/firebase/converters/exchangeConverter';

const getExchangeByCmcId = async (cmcId: number): Promise<Exchange | null> => {
  const ExchangeCollection = firestore()
    .collection(FirebaseCollections.EXCHANGES)
    .where('cmcId', '==', cmcId)
    .withConverter(ExchangeConverter);

  const querySnapshot = await ExchangeCollection.get();

  return !querySnapshot.empty ? querySnapshot.docs[0].data() : null;
};

export default getExchangeByCmcId;
