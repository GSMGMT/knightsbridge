import {
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp,
  WithFieldValue,
} from 'firebase/firestore';
import { Asset } from '@contracts/Wallet';

export const AssetConverter = {
  toFirestore: (data: WithFieldValue<Asset>): DocumentData => data,
  fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>): Asset => {
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
