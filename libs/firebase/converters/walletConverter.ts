import {
  DocumentData,
  QueryDocumentSnapshot,
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
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    };
  },
};
