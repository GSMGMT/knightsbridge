import {
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp,
  WithFieldValue,
} from 'firebase/firestore';
import { Currency } from '@contracts/Currency';

export const FiatCurrencyConverter = {
  toFirestore: (data: WithFieldValue<Currency>): DocumentData => data,
  fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>): Currency => {
    const data = snapshot.data();

    return {
      uid: data.uid,
      name: data.name,
      type: data.type,
      logo: data.logo,
      symbol: data.symbol,
      cmcId: data.cmcId,
      quote: data.quote,
      createdAt: (data.createdAt as Timestamp).toDate(),
      updatedAt: (data.updatedAt as Timestamp).toDate(),
    };
  },
};
