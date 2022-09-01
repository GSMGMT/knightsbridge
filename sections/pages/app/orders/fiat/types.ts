export type Status =
  | 'PENDING'
  | 'PROCESSING'
  | 'REJECTED'
  | 'CONFIRMED'
  | 'EXPIRED';

export interface Currency {
  id: string;
  code: string;
  quote: number;
}

export interface User {
  name: string;
  email: string;
}

export interface PaymentMethod {
  type: string;
  name: string;
}

export interface Item {
  currency: Currency;
  quantity: number;
  method: PaymentMethod;
  date: Date;
  referenceIdentifier: string;
  id: string;
  user: User;
  status: Status;
  receipt: string;
}

export type HandleChangeStatus = (
  status: 'CONFIRMED' | 'REJECTED',
  ...id: Array<string>
) => void;

export type Variant = 'CONFIRM' | 'REJECT';

export type SortBy = 'createdAt' | 'status' | 'amount' | 'referenceNo';
