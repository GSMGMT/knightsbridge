import { OmitTimestamp } from '@utils/types';
import { Currency } from './Currency';
import { UserData } from './User';

export type Asset = {
  uid: string;
  amount: number;
  reserved: number;
  currency: OmitTimestamp<Currency>;
  createdAt: Date;
  updatedAt: Date;
};

export type Wallet = {
  uid: string;
  user: UserData;
  createdAt: Date;
  updatedAt: Date;
};
