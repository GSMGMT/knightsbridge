import { Currency } from '@contracts/Currency';
import {
  DocumentData,
  QueryDocumentSnapshot,
  WithFieldValue,
} from 'firebase/firestore';

export const CurrencyConverter = {
  toFirestore: (data: WithFieldValue<Currency>): DocumentData => data,
  fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>): Currency => {
    const data = snapshot.data();

    return {
      uid: data.uid,
      name: data.name,
      symbol: data.symbol,
      logo: `${process.env.API_URL}/currency/${data.logo}`,
      sign: data.sign,
      cmcId: data.cmcId,
      quote: data.quote,
      type: data.type,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    };
  },
};
