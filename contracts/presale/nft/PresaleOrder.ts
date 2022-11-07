import { OmitTimestamp } from '@utils/types';
import { PresaleNFT } from './PresaleCoin';
import { User } from '../../User';

export interface PresaleOrder {
  uid: string;
  nft: OmitTimestamp<PresaleNFT>;
  fee: number;
  user: OmitTimestamp<User>;
  createdAt: Date;
  updatedAt: Date;
}
