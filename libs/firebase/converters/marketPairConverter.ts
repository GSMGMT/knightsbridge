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
      exchange: {
        ...data.exchange,
        logo: `${process.env.API_URL}/${data.exchange.logo}`,
      },
      name: data.name,
      cmcId: data.cmcId,
      base: {
        ...data.base,
        logo: `${process.env.API_URL}/${data.base.logo}`,
      },
      quote: {
        ...data.quote,
        logo: `${process.env.API_URL}/${data.quote.logo}`,
      },
      enabled: data.enabled,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    };
  },
};
