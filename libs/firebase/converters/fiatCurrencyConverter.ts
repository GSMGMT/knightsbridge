import {
  DocumentData,
  QueryDocumentSnapshot,
  WithFieldValue,
} from 'firebase/firestore';
import { FiatCurrency } from '@contracts/FIAT/Currency';

export const FiatCurrencyConverter = {
  toFirestore: (data: WithFieldValue<FiatCurrency>): DocumentData => data,
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<DocumentData>
  ): FiatCurrency => {
    const data = snapshot.data();

    return {
      uid: data.uid,
      name: data.name,
      code: data.code,
      logo: data.logo,
      symbol: data.symbol,
      cmcId: data.cmcId,
      quote: data.quote,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};
