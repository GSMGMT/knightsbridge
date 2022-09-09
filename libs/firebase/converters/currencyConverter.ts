import { Currency } from '@contracts/Currency';
import {
  DocumentData,
  QueryDocumentSnapshot,
  WithFieldValue,
} from '@libs/firebase/admin-config';

export const CurrencyConverter = {
  toFirestore: (data: WithFieldValue<Currency>): DocumentData => data,
  fromFirestore: (snapshot: QueryDocumentSnapshot): Currency => {
    const data = snapshot.data();

    return {
      uid: data.uid,
      name: data.name,
      symbol: data.symbol,
      logo: `${process.env.API_URL}/${data.logo}`,
      sign: data.sign,
      cmcId: data.cmcId,
      quote: data.quote,
      type: data.type,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    };
  },
};
