import { Address } from './Addres';

export type CurrencyType = 'crypto' | 'fiat';

type CryptoAddress =
  | {
      deposit: true;
      walletAddresses: Address[];
    }
  | {
      deposit: false;
      walletAddresses?: never;
    };
type CurrencyTypeI =
  | {
      type: 'fiat';
      sign: string;
      deposit?: never;
      walletAddresses?: never;
    }
  | ({
      type: 'crypto';
      sign?: never;
    } & CryptoAddress);
export type Currency = CurrencyTypeI & {
  uid: string;
  name: string;
  symbol: string;
  logo: string;
  cmcId: number;
  quote?: number;
  createdAt: Date;
  updatedAt: Date;
};
