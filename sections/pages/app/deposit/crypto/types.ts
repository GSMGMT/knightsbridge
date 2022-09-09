import { Coin as PairedCoin } from '@services/api/app/fetchCoins';

export type Coin = Pick<
  PairedCoin,
  'uid' | 'logo' | 'name' | 'symbol' | 'price'
>;
export type Coins = Array<Coin>;

export type Address = Pick<PairedCoin, 'uid' | 'walletAddresses'>;
export type Addresses = Array<Address>;
