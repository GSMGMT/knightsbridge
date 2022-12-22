import { OmitTimestamp } from '@utils/types';
import { Stock } from './Stock';

export type StockAsset = {
  uid: string;
  amount: number;
  reserved: number;
  stock: OmitTimestamp<Stock>;
  createdAt: Date;
  updatedAt: Date;
};
