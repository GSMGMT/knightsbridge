import { FiatDeposit } from '@contracts/FiatDeposit';

type ListDeposit = (data?: {
  sortBy?: string;
  email?: string;
}) => Promise<Array<FiatDeposit>>;
export const listDeposit: ListDeposit = async () => [];
