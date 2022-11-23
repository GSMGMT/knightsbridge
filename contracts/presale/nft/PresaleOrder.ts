import { OmitTimestamp } from '@utils/types';
import { PresaleNFT } from './PresaleCoin';
import { User } from '../../User';

export type PresaleAsset = Omit<
  OmitTimestamp<PresaleNFT>,
  'amount' | 'amountAvailable'
>;
export interface PresaleOrder {
  uid: string;
  nft: PresaleAsset;
  fee: number;
  user: OmitTimestamp<User>;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}
