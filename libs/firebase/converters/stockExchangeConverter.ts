import { StockExchange } from '@contracts/StockExchange';
import {
  DocumentData,
  QueryDocumentSnapshot,
  WithFieldValue,
} from '@libs/firebase/admin-config';

export const StockExchangeConverter = {
  toFirestore: (data: WithFieldValue<StockExchange>): DocumentData => data,
  fromFirestore: (snapshot: QueryDocumentSnapshot): StockExchange => {
    const data = snapshot.data();

    return {
      uid: data.uid,
      name: data.name,
      acronym: data.acronym,
      country: data.country,
      countryCode: data.countryCode,
      mic: data.mic,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    };
  },
};
