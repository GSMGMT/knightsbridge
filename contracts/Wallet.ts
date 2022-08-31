import { Currency } from './Currency';
import { UserData } from './User';

type Asset = {
  amount: number;
  reserved: number;
  currency: Currency;
};

export type Wallet = {
  uid: string;
  user: UserData;
  assets: Asset[];
  createdAt: Date;
  updatedAt: Date;
};
