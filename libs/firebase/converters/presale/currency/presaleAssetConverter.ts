import {
  DocumentData,
  QueryDocumentSnapshot,
  WithFieldValue,
} from '@libs/firebase/admin-config';
import { PresaleAsset } from '@contracts/presale/currency/PresaleAsset';

export const PresaleAssetConverter = {
  toFirestore: (data: WithFieldValue<PresaleAsset>): DocumentData => data,
  fromFirestore: (snapshot: QueryDocumentSnapshot): PresaleAsset => {
    const data = snapshot.data();

    return {
      uid: data.uid,
      amount: data.amount,
      coin: {
        icon: `${process.env.API_URL}/${data.coin.icon}`,
        baseCurrency: {
          logo: `${process.env.API_URL}/${data.coin.baseCurrency.logo}`,
          ...data.coin.baseCurrency,
        },
        ...data.coin,
      },
      updatedAt: data.updatedAt?.toDate(),
      createdAt: data.createdAt?.toDate(),
    };
  },
};
