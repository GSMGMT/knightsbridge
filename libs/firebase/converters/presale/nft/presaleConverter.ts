import {
  DocumentData,
  QueryDocumentSnapshot,
  WithFieldValue,
} from '@libs/firebase/admin-config';
import { PresaleCoin } from '@contracts/presale/nft/PresaleCoin';

export const PresaleConverter = {
  toFirestore: (data: WithFieldValue<PresaleCoin>): DocumentData => data,
  fromFirestore: (snapshot: QueryDocumentSnapshot): PresaleCoin => {
    const data = snapshot.data();

    return {
      uid: data.uid,
      name: data.name,
      amountAvailable: data.amountAvailable,
      author: data.author,
      quote: data.quote,
      amount: data.amount,
      icon: `${process.env.API_URL}/${data.icon}`,
      baseCurrency: {
        ...data.baseCurrency,
        logo: `${process.env.API_URL}/${data.baseCurrency.logo}`,
      },
      updatedAt: data.updatedAt?.toDate(),
      createdAt: data.createdAt?.toDate(),
    };
  },
};
