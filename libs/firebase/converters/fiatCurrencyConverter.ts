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
      symbol: data.symbol,
      logo: `${process.env.API_URL}/${data.logo}`,
      cmcId: data.cmcId,
      quote: data.quote,
      type: data.type,
      sign: data.sign,
      deposit: data.deposit,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    };
  },
};
