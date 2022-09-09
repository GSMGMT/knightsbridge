import {
  DocumentData,
  QueryDocumentSnapshot,
  WithFieldValue,
} from 'firebase/firestore';
import { FiatDeposit } from '@contracts/FiatDeposit';

export const FiatDepositConverter = {
  toFirestore: (data: WithFieldValue<FiatDeposit>): DocumentData => data,
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<DocumentData>
  ): FiatDeposit => {
    const data = snapshot.data();

    return {
      uid: data.uid,
      amount: data.amount,
      bank: data.bank,
      currency: {
        ...data.currency,
        logo: `${process.env.API_URL}/${data.currency.logo}`,
      },
      referenceNo: data.referenceNo,
      status: data.status,
      user: data.user,
      receipt: data.receipt
        ? `${process.env.API_URL}/${data.receipt}`
        : undefined,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    };
  },
};
