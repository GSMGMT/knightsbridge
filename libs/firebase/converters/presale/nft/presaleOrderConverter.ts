import {
  DocumentData,
  QueryDocumentSnapshot,
  WithFieldValue,
} from '@libs/firebase/admin-config';

import { PresaleOrder } from '@contracts/presale/nft/PresaleOrder';

export const PresaleOrderConverter = {
  toFirestore: (data: WithFieldValue<PresaleOrder>): DocumentData => data,
  fromFirestore: (snapshot: QueryDocumentSnapshot): PresaleOrder => {
    const data = snapshot.data();

    return {
      uid: data.uid,
      fee: data.fee,
      nft: {
        ...data.nft,
        baseCurrency: {
          ...data.nft.baseCurrency,
          logo: `${process.env.API_URL}/${data.nft.baseCurrency.logo}`,
        },
        icon: `${process.env.API_URL}/${data.nft.icon}`,
      },
      user: data.user,
      updatedAt: data.updatedAt?.toDate(),
      createdAt: data.createdAt?.toDate(),
    };
  },
};
