import {
  DocumentData,
  QueryDocumentSnapshot,
  WithFieldValue,
} from 'firebase/firestore';
import { Bank } from '@contracts/Bank';

export const BankConverter = {
  toFirestore: (data: WithFieldValue<Bank>): DocumentData => data,
  fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>): Bank => {
    const data = snapshot.data();

    return {
      uid: data.uid,
      accountName: data.accountName,
      accountNumber: data.accountNumber,
      address: data.address,
      swiftCode: data.swiftCode,
      bankName: data.bankName,
      branch: data.branch,
      bankAddress: data.bankAddress,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};
