import { CryptoCurrency } from '../currency/PresaleCoin';

export interface PresaleNFT {
  uid: string;
  name: string;
  author: string;
  icon: string;
  baseCurrency: CryptoCurrency;
  quote: number;
  amount: number;
  amountAvailable: number;
  createdAt: Date;
  updatedAt: Date;
}
