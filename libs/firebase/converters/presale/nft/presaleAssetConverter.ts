import {
  DocumentData,
  QueryDocumentSnapshot,
  WithFieldValue,
} from '@libs/firebase/admin-config';
import { PresaleAsset } from '@contracts/presale/nft/PresaleAsset';

export const PresaleAssetConverter = {
  toFirestore: (data: WithFieldValue<PresaleAsset>): DocumentData => data,
  fromFirestore: (snapshot: QueryDocumentSnapshot): PresaleAsset => {
    const data = snapshot.data();

    return {
      uid: data.uid,
      nft: {
        ...data.nft,
        baseCurrency: {
          ...data.nft.baseCurrency,
          logo: `${process.env.API_URL}/${data.nft.baseCurrency.logo}`,
        },
        icon: `${process.env.API_URL}/${data.nft.icon}`,
      },
      updatedAt: data.updatedAt?.toDate(),
      createdAt: data.createdAt?.toDate(),
    };
  },
};
