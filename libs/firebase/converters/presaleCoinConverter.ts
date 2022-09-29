import {
  DocumentData,
  QueryDocumentSnapshot,
  WithFieldValue,
} from 'firebase/firestore';
import { PresaleCoin } from '@contracts/PresaleCoin';

export const PresaleCoinConverter = {
  toFirestore: (data: WithFieldValue<PresaleCoin>): DocumentData => data,
  fromFirestore: (snapshot: QueryDocumentSnapshot): PresaleCoin => {
    const data = snapshot.data();

    return {
      uid: data.uid,
      name: data.name,
      symbol: data.symbol,
      quote: data.quote,
      icon: `${process.env.API_URL}/${data.icon}`,
      baseCurrency: {
        ...data.baseCurrency,
        logo: `${process.env.API_URL}/${data.baseCurrency.logo}`,
      },
      availableAt: data.availableAt.toDate(),
      updatedAt: data.updatedAt?.toDate(),
      createdAt: data.createdAt?.toDate(),
    };
  },
};
