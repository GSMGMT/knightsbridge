import { Address } from '@contracts/Addres';
import {
  DocumentData,
  QueryDocumentSnapshot,
  WithFieldValue,
} from '@libs/firebase/admin-config';

export const AddressConverter = {
  toFirestore: (data: WithFieldValue<Address>): DocumentData => data,
  fromFirestore: (snapshot: QueryDocumentSnapshot): Address => {
    const data = snapshot.data();

    return {
      uid: data.uid,
      address: data.address,
      network: data.network,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    };
  },
};
