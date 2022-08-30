import { Bank } from '@contracts/Bank';
import { api } from '@services/api';

type FetchBanks = () => Promise<Array<Bank>>;
export const fetchBanks: FetchBanks = async () => {
  const {
    data: { data },
  } = await api.get<{ data: Array<Bank> }>('/api/fiat/bank', {
    params: {
      pageNumber: 1,
      pageSize: 10,
    },
  });

  return [...data];
};
