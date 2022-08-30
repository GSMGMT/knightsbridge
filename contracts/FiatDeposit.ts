import { OmitTimestamp } from '@utils/types';
import { Bank } from './Bank';
import { FiatCurrency } from './FiatCurrency';
import { User } from './User';

export enum FIATDepositStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  REJECTED = 'REJECTED',
  CONFIRMED = 'CONFIRMED',
  EXPIRED = 'EXPIRED',
}

export interface FiatDeposit {
  uid?: string;
  amount: number;
  referenceNo: string;
  receipt?: string;
  status: FIATDepositStatus;
  currency: OmitTimestamp<FiatCurrency>;
  bank: OmitTimestamp<Bank>;
  user: Omit<User, 'accessToken' | 'refreshToken' | 'role'>;
  createdAt: Date;
  updatedAt: Date;
}
