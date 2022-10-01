import { OmitTimestamp } from '@utils/types';
import { PresaleCoin } from './PresaleCoin';

type Coin = Omit<OmitTimestamp<PresaleCoin>, 'amount'>;
export interface PresaleAsset {
  uid: string;
  coin: Coin;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}
