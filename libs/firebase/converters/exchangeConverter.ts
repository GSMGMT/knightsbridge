import { Exchange } from '@contracts/Exchange';
import {
  DocumentData,
  QueryDocumentSnapshot,
  WithFieldValue,
} from '@libs/firebase/admin-config';

export const ExchangeConverter = {
  toFirestore: (data: WithFieldValue<Exchange>): DocumentData => data,
  fromFirestore: (snapshot: QueryDocumentSnapshot): Exchange => {
    const data = snapshot.data();

    return {
      uid: data.uid,
      cmcId: data.cmcId,
      name: data.name,
      slug: data.slug,
      logo: `${process.env.API_URL}/${data.logo}`,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    };
  },
};
