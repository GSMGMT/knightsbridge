import { Order } from '@contracts/Order';
import {
  DocumentData,
  QueryDocumentSnapshot,
  WithFieldValue,
} from '@libs/firebase/admin-config';

export const OrderConverter = {
  toFirestore: (data: WithFieldValue<Order>): DocumentData => data,
  fromFirestore: (snapshot: QueryDocumentSnapshot): Order => {
    const data = snapshot.data();

    return {
      uid: data.uid,
      type: data.type,
      action: data?.action || 'market',
      user: data.user,
      marketPair: data.marketPair,
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
