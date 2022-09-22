import { OmitTimestamp } from '@utils/types';
import { Address } from './Addres';
import { Currency } from './Currency';
import { UserData } from './User';

export enum CRYPTODepositStatus {
  PROCESSING = 'PROCESSING',
  REJECTED = 'REJECTED',
  CONFIRMED = 'CONFIRMED',
}

export type CryptoCurrency = Omit<OmitTimestamp<Currency>, 'sign' | 'quote'>;

export interface CryptoDeposit {
  uid: string;
  amount: number;
  transactionHash: string;
  status: CRYPTODepositStatus;
  currency: CryptoCurrency;
  address: OmitTimestamp<Address>;
  user: UserData;
  createdAt: Date;
  updatedAt: Date;
}

export type CryptoDepositUpdateQuery = Partial<
  Pick<CryptoDeposit, 'transactionHash' | 'amount' | 'status'>
>;
