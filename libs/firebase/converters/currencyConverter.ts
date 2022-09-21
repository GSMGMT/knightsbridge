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
      cmcId: data.cmcId,
      quote: data.quote ?? null,
      type: data.type,
      sign: data.type === 'fiat' ? data.sign : null,
      deposit: data.type === 'crypto' ? data.deposit : null,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    };
  },
};
