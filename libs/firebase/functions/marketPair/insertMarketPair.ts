import { v4 as uuidv4 } from 'uuid';

import { Currency } from '@contracts/Currency';
import { Exchange } from '@contracts/Exchange';
import { FirebaseCollections } from '@libs/firebase/collections';
import { firestore } from '@libs/firebase/admin-config';
import { MarketPairConverter } from '@libs/firebase/converters/marketPairConverter';
import { OmitTimestamp } from '@utils/types';

interface InsertMarketPair {
  exchange: OmitTimestamp<Exchange>;
  name: string;
  cmcId: number;
  base: OmitTimestamp<Currency>;
  quote: OmitTimestamp<Currency>;
}

const insertMarketPair = async (newMarketPair: InsertMarketPair) => {
  const uid = uuidv4();
  const serverTime = firestore.FieldValue.serverTimestamp();

  const MarketPairDoc = firestore()
    .collection(FirebaseCollections.MARKET_PAIRS)
    .doc(uid)
    .withConverter(MarketPairConverter);

  await MarketPairDoc.set({
    uid,
    ...newMarketPair,
    enabled: true,
    createdAt: serverTime,
    updatedAt: serverTime,
  });

  return uid;
};

export default insertMarketPair;
