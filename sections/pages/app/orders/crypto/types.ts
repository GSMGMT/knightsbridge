export type Status = 'PROCESSING' | 'REJECTED' | 'CONFIRMED';

export interface User {
  name: string;
  email: string;
}

export interface Item {
  id: string;
  user: User;
  currency: string;
  amount: number;
  date: Date;
  transactionHash: string;
  status: Status;
  network: string;
}

export type HandleChangeStatus = (
  status: 'CONFIRMED' | 'REJECTED',
  ...id: Array<string>
) => void;

export type Variant = 'CONFIRM' | 'REJECT';

export type SortBy = 'type' | 'fee' | 'amount' | 'price' | 'total' | 'status';
export type HandleSetSortBy = (sortBy: SortBy) => void;
