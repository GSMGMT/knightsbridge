import { OmitTimestamp } from '@utils/types';

import { MarketPair } from './MarketPair';
import { User } from './User';

export enum OrderStatus {
  PROCESSING = 'PROCESSING',
  APPROVED = 'APPROVED',
  CANCELED = 'CANCELED',
  REJECTED = 'REJECTED',
}

export type OrderType = 'buy' | 'sell';

export type Order = {
  uid: string;
  type: OrderType;
  action: string;
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

export type BidAndAsk = {
  uid: string;
  price: number;
  amount: number;
  total: number;
};

export type OrderUpdateQuery = Partial<Pick<Order, 'status'>>;
