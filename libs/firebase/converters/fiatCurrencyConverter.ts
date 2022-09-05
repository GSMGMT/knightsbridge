import {
  DocumentData,
  QueryDocumentSnapshot,
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
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    };
  },
};
