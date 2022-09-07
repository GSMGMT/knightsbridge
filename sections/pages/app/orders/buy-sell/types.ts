export type Status = 'APPROVED' | 'PROCESSING' | 'REJECTED' | 'CANCELED';

export interface User {
  name: string;
  email: string;
}

export type Type = 'BUY' | 'SELL';

export interface Pair {
  name: string;
}

export interface Exchange {
  name: string;
}

export interface Item {
  id: string;
  type: Type;
  pair: Pair;
  exchange: Exchange;
  date: Date;
  user: User;
  fee: number;
  quantity: number;
  price: number;
  total: number;
  status: Status;
}

export type HandleChangeStatus = (
  status: 'APPROVED' | 'REJECTED',
  ...id: Array<string>
) => void;

export type Variant = 'APPROVE' | 'REJECT';

export type SortBy = 'type' | 'fee' | 'amount' | 'price' | 'total' | 'status';
export type HandleSetSortBy = (sortBy: SortBy) => void;
