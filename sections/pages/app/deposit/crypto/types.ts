import { Coin as PairedCoin } from '@services/api/app/fetchCoins';

export type Coin = Pick<
  PairedCoin,
  'id' | 'logo' | 'name' | 'symbol' | 'price'
>;
export type Coins = Array<Coin>;

export type Address = Pick<PairedCoin, 'id' | 'walletAddresses'>;
export type Addresses = Array<Address>;
