import { StockOrder } from '@contracts/StockOrder';
import {
  DocumentData,
  QueryDocumentSnapshot,
  WithFieldValue,
} from '@libs/firebase/admin-config';

export const StockOrderConverter = {
  toFirestore: (data: WithFieldValue<StockOrder>): DocumentData => data,
  fromFirestore: (snapshot: QueryDocumentSnapshot): StockOrder => {
    const data = snapshot.data();

    return {
      uid: data.uid,
      type: data.type,
      user: data.user,
      stockPair: data.stockPair,
      price: data.price,
      amount: data.amount,
      total: data.total,
      fee: data.fee,
      status: data.status,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    };
  },
};
