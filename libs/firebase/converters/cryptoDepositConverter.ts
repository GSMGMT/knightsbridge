import {
  DocumentData,
  QueryDocumentSnapshot,
  WithFieldValue,
} from 'firebase/firestore';
import { CryptoDeposit } from '@contracts/CryptoDeposit';

export const CryptoDepositConverter = {
  toFirestore: (data: WithFieldValue<CryptoDeposit>): DocumentData => data,
  fromFirestore: (snapshot: QueryDocumentSnapshot): CryptoDeposit => {
    const data = snapshot.data();

    return {
      uid: data.uid,
      amount: data.amount,
      status: data.status,
      currency: {
        ...data.currency,
        logo: `${process.env.API_URL}/${data.currency.logo}`,
      },
      address: data.address,
      transactionHash: data.transactionHash,
      user: data.user,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    };
  },
};
