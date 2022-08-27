import { collection, getDoc, getDocs, query, where } from 'firebase/firestore';

import { User } from '@contracts/User';
import { UserConverter } from '@libs/firebase/converters/userConverter';
import { FirebaseCollections } from '@libs/firebase/collections';
import { firestore } from '@libs/firebase/config';
import { ReferralConverter } from '@libs/firebase/converters/referralConverter';

const getReferralByCode = async (
  code: string
): Promise<{ code: string; user: User } | null> => {
  const ReferralCollection = collection(
    firestore,
    FirebaseCollections.REFERRALS
  ).withConverter(ReferralConverter);

  const referralSnap = await getDocs(
    query(ReferralCollection, where('code', '==', code))
  );

  if (referralSnap.empty) {
    return null;
  }

  const referral = referralSnap.docs[0].data();

  const userSnapshot = await getDoc(referral.user.withConverter(UserConverter));
  const user = userSnapshot.data()!;

  return {
    code,
    user,
  };
};

export default getReferralByCode;
