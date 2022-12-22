import { StockPair } from '@contracts/StockPair';
import {
  DocumentData,
  QueryDocumentSnapshot,
  WithFieldValue,
} from '@libs/firebase/admin-config';

export const StockPairConverter = {
  toFirestore: (data: WithFieldValue<StockPair>): DocumentData => data,
  fromFirestore: (snapshot: QueryDocumentSnapshot): StockPair => {
    const data = snapshot.data();

    return {
      uid: data.uid,
      crypto: {
        ...data.crypto,
        logo: `${process.env.API_URL}/${data.crypto.logo}`,
      },
      stock: data.stock,
      exchange: data.exchange,
      enabled: data.enabled,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    };
  },
};
