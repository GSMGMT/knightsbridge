import { firestore } from 'firebase-admin';

import { FirebaseCollections } from '@libs/firebase/collections';
import { MarketPairUpdateQuery } from '@contracts/MarketPair';
import { MarketPairConverter } from '@libs/firebase/converters/marketPairConverter';

const updateMarketPair = async (
  marketPairUid: string,
  fieldsToUpdate: MarketPairUpdateQuery
) => {
  const serverTime = firestore.FieldValue.serverTimestamp();

  const MarketPairDoc = firestore()
    .collection(FirebaseCollections.MARKET_PAIRS)
    .doc(marketPairUid)
    .withConverter(MarketPairConverter);

  await firestore().runTransaction(async (transaction) => {
    transaction.update(MarketPairDoc, {
      ...fieldsToUpdate,
      updatedAt: serverTime,
    });
  });
};

export default updateMarketPair;
