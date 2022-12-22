import { Stock } from '@contracts/Stock';
import {
  DocumentData,
  QueryDocumentSnapshot,
  WithFieldValue,
} from '@libs/firebase/admin-config';

export const StockConverter = {
  toFirestore: (data: WithFieldValue<Stock>): DocumentData => data,
  fromFirestore: (snapshot: QueryDocumentSnapshot): Stock => {
    const data = snapshot.data();

    return {
      uid: data.uid,
      name: data.name,
      symbol: data.symbol,
      history: data.history,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    };
  },
};
