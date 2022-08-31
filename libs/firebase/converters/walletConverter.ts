import {
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp,
  WithFieldValue,
} from 'firebase/firestore';
import { Wallet } from '@contracts/Wallet';

export const WalletConverter = {
  toFirestore: (data: WithFieldValue<Wallet>): DocumentData => data,
  fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>): Wallet => {
    const data = snapshot.data();

    return {
      uid: data.uid,
      user: data.user,
      assets: data.assets,
      createdAt: (data.createdAt as Timestamp).toDate(),
      updatedAt: (data.updatedAt as Timestamp).toDate(),
    };
  },
};
