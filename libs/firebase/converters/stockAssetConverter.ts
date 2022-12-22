import { StockAsset } from '@contracts/StockAsset';
import {
  DocumentData,
  QueryDocumentSnapshot,
  WithFieldValue,
} from '@libs/firebase/admin-config';

export const StockAssetConverter = {
  toFirestore: (data: WithFieldValue<StockAsset>): DocumentData => data,
  fromFirestore: (snapshot: QueryDocumentSnapshot): StockAsset => {
    const data = snapshot.data();

    return {
      uid: data.uid,
      amount: data.amount,
      stock: data.stock,
      reserved: data.reserved,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    };
  },
};
