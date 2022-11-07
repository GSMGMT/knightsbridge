import { OmitTimestamp } from '@utils/types';
import { PresaleNFT } from './PresaleCoin';

export type NFT = Omit<OmitTimestamp<PresaleNFT>, 'amount' | 'amountAvailable'>;
export interface PresaleAsset {
  uid: string;
  nft: NFT;
  createdAt: Date;
  updatedAt: Date;
}
