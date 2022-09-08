import { Fee } from '@contracts/Fee';
import {
  DocumentData,
  QueryDocumentSnapshot,
  WithFieldValue,
} from '@libs/firebase/admin-config';

export const FeeConverter = {
  toFirestore: (data: WithFieldValue<Fee>): DocumentData => data,
  fromFirestore: (snapshot: QueryDocumentSnapshot): Fee => {
    const data = snapshot.data();

    return {
      uid: data.uid,
      percentage: data.percentage,
      type: data.type,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    };
  },
};
