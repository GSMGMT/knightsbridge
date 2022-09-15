import { Bank, FiatCurrency } from '@pages/app/deposit/fiat';

export interface Request {
  id: string;
  referenceNumber: string;
  amount: string;
  bank: Bank;
  currency: FiatCurrency;
}
