import { Asset } from '@contracts/Wallet';
import {
  DocumentData,
  QueryDocumentSnapshot,
  WithFieldValue,
} from '@libs/firebase/admin-config';

export const AssetConverter = {
  toFirestore: (data: WithFieldValue<Asset>): DocumentData => data,
  fromFirestore: (snapshot: QueryDocumentSnapshot): Asset => {
    const data = snapshot.data();

    return {
      uid: data.uid,
      amount: data.amount,
      currency: {
        ...data.currency,
        logo: `${process.env.API_URL}/currency/${data.currency.logo}`,
      },
      reserved: data.reserved,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    };
  },
};
