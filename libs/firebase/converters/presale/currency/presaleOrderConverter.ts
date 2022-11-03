import {
  DocumentData,
  QueryDocumentSnapshot,
  WithFieldValue,
} from '@libs/firebase/admin-config';
import { PresaleOrder } from '@contracts/presale/currency/PresaleOrder';

export const PresaleOrderConverter = {
  toFirestore: (data: WithFieldValue<PresaleOrder>): DocumentData => data,
  fromFirestore: (snapshot: QueryDocumentSnapshot): PresaleOrder => {
    const data = snapshot.data();

    return {
      uid: data.uid,
      amount: data.amount,
      fee: data.fee,
      coin: {
        icon: `${process.env.API_URL}/${data.coin.icon}`,
        baseCurrency: {
          logo: `${process.env.API_URL}/${data.coin.baseCurrency.logo}`,
          ...data.coin.baseCurrency,
        },
        ...data.coin,
      },
      user: data.user,
      updatedAt: data.updatedAt?.toDate(),
      createdAt: data.createdAt?.toDate(),
    };
  },
};
