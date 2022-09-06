import { MarketPair } from '@contracts/MarketPair';
import {
  DocumentData,
  QueryDocumentSnapshot,
  WithFieldValue,
} from '@libs/firebase/admin-config';

export const MarketPairConverter = {
  toFirestore: (data: WithFieldValue<MarketPair>): DocumentData => data,
  fromFirestore: (snapshot: QueryDocumentSnapshot): MarketPair => {
    const data = snapshot.data();

    return {
      uid: data.uid,
      exchange: data.exchange,
      name: data.name,
      cmcId: data.cmcId,
      base: data.base,
      quote: data.quote,
      enabled: data.enabled,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    };
  },
};
