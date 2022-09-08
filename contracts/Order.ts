import { OmitTimestamp } from '@utils/types';

import { MarketPair } from './MarketPair';
import { User } from './User';

export enum OrderStatus {
  PROCESSING = 'PROCESSING',
  APPROVED = 'APPROVED',
  CANCELED = 'CANCELED',
  REJECTED = 'REJECTED',
}

export type Order = {
  uid: string;
  type: 'buy' | 'sell';
  user: OmitTimestamp<User>;
  marketPair: OmitTimestamp<MarketPair>;
  price: number;
  amount: number;
  total: number;
  fee: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
};
