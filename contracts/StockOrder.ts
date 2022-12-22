import { OmitTimestamp } from '@utils/types';

import { StockPair } from './StockPair';
import { User } from './User';

export enum StockOrderStatus {
  PROCESSING = 'PROCESSING',
  APPROVED = 'APPROVED',
  CANCELED = 'CANCELED',
  REJECTED = 'REJECTED',
}

export type StockOrderType = 'buy' | 'sell';

export type StockOrder = {
  uid: string;
  type: StockOrderType;
  user: OmitTimestamp<User>;
  stockPair: OmitTimestamp<StockPair>;
  price: number;
  amount: number;
  total: number;
  fee: number;
  status: StockOrderStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type StockOrderUpdateQuery = Partial<Pick<StockOrder, 'status'>>;
