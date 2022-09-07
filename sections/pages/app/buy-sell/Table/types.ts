export type TypeOrder = 'BUY' | 'SELL';

export type OrderStatus = 'PROCESSING' | 'APPROVED' | 'REJECTED' | 'CANCELED';

export interface Order {
  id: string;
  type: TypeOrder;
  createdAt: Date;
  asset: string;
  price: number;
  amount: number;
  total: number;
  status: OrderStatus;
}

export type SortBy =
  | 'type'
  | 'createdAt'
  | 'price'
  | 'amount'
  | 'total'
  | 'status';
export type HandleSetSortBy = (sortBy: SortBy) => void;
