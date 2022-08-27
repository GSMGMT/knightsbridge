import getReferralByCode from '@libs/firebase/functions/referral/getReferralByCode';
import { User } from './User';

export interface Referral {
  code: string;
  user: User;
  referredBy?: User;
}

export const verifyReferral = async (code: string) => {
  const referral = await getReferralByCode(code);

  if (!referral) {
    throw new Error('Referral not found');
  }

  return referral;
};
