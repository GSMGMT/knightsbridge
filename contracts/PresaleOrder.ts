import { OmitTimestamp } from '@utils/types';
import { PresaleCoin } from './PresaleCoin';
import { User } from './User';

export interface PresaleOrder {
  uid: string;
  coin: OmitTimestamp<PresaleCoin>;
  amount: number;
  fee: number;
  user: OmitTimestamp<User>;
  createdAt: Date;
  updatedAt: Date;
}
