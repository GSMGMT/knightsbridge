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
      currency: data.currency,
      referenceNo: data.referenceNo,
      status: data.status,
      user: data.user,
      receipt: data.receipt,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    };
  },
};
