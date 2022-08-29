import {
  DocumentData,
  QueryDocumentSnapshot,
  WithFieldValue,
} from 'firebase/firestore';
import { Deposit } from '@contracts/FiatDeposit';

export const DepositConverter = {
  toFirestore: (data: WithFieldValue<Deposit>): DocumentData => data,
  fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>): Deposit => {
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
      createdAt: new Date(data.createdAt * 1000),
      updatedAt: new Date(data.updatedAt * 1000),
    };
  },
};
