import {
  addDoc,
  collection,
  doc,
  DocumentData,
  DocumentReference,
} from 'firebase/firestore';
import { nanoid } from 'nanoid';

import { firestore } from '@libs/firebase/config';
import { FirebaseCollections } from '@libs/firebase/collections';

const insertReferral = async (userUid: string, referredBy?: string) => {
  const ReferralCollection = collection(
    firestore,
    FirebaseCollections.REFERRALS
  );

  const UserDoc = doc(firestore, FirebaseCollections.USERS, userUid);

  const data: {
    code: string;
    user: DocumentReference<DocumentData>;
    referredBy?: DocumentReference<DocumentData>;
  } = {
    code: `${nanoid(6)}_${nanoid(5)}`,
    user: UserDoc,
  };

  if (referredBy) {
    data.referredBy = doc(firestore, FirebaseCollections.USERS, referredBy);
  }

  await addDoc(ReferralCollection, data);
};

export default insertReferral;
