import { Asset } from '@contracts/Wallet';
import {
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp,
  WithFieldValue,
} from '@libs/firebase-admin/config';

export const AssetConverter = {
  toFirestore: (data: WithFieldValue<Asset>): DocumentData => data,
  fromFirestore: (snapshot: QueryDocumentSnapshot): Asset => {
    const data = snapshot.data();

    return {
      uid: data.uid,
      amount: data.amount,
      currency: data.currency,
      reserved: data.reserved,
      createdAt: (data.createdAt as Timestamp).toDate(),
      updatedAt: (data.updatedAt as Timestamp).toDate(),
    };
  },
};
