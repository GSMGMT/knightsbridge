import { OmitTimestamp } from '@utils/types';
import { Bank } from './Bank';
import { Currency } from './Currency';
import { UserData } from './User';

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
  currency: OmitTimestamp<Currency>;
  bank: OmitTimestamp<Bank>;
  user: UserData;
  createdAt: Date;
  updatedAt: Date;
}
