import { Referral } from '@contracts/Referral';
import { User } from '@contracts/User';
import { DocumentReference } from 'firebase/firestore';

interface ReferralFromFirestore extends Omit<Referral, 'user' | 'referredBy'> {
  user: DocumentReference<User>;
  referredBy?: DocumentReference<User>;
}

export const ReferralConverter = {
  toFirestore: () => ({}),
  fromFirestore: (
    snapshot: { data: (arg0: any) => any },
    options: any
  ): ReferralFromFirestore => {
    const data = snapshot.data(options);

    return {
      code: data.code,
      user: data.user,
      referredBy: data?.referredBy,
    };
  },
};
