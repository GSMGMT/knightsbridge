import { Currency } from '@contracts/Currency';
import { Address as DefaultAddress } from '@contracts/Addres';

export type Coin = Pick<
  Currency,
  'uid' | 'logo' | 'name' | 'symbol' | 'quote' | 'walletAddresses'
>;
export type Coins = Array<Coin>;

export type Address = Omit<DefaultAddress, 'createdAt' | 'updatedAt'>;
export type CoinAddress = Required<
  Pick<Coin, 'uid'> & {
    walletAddresses: Address[];
  }
>;
export type Addresses = Array<CoinAddress>;
