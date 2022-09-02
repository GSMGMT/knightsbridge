import { FiatDeposit } from '@contracts/FiatDeposit';
import { api } from '@services/api';

type ListDeposit = (data?: {
  sortBy?: string;
  email?: string;
}) => Promise<Array<FiatDeposit>>;
export const listDeposit: ListDeposit = async (data = {}) => {
  const { email, sortBy } = data;

  const {
    data: { data: deposit },
  } = await api.get<{ data: Array<FiatDeposit> }>('/api/fiat/deposit', {
    params: {
      search: email,
      sort: sortBy,
    },
  });

  return deposit;
};
