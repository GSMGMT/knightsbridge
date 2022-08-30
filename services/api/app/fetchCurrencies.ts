import { FiatCurrency } from '@contracts/FiatCurrency';

import { api } from '@services/api';

export const fetchCurrencies: () => Promise<Array<FiatCurrency>> = async () => {
  const {
    data: { data },
  } = await api.get<{ data: Array<FiatCurrency> }>('/api/fiat/currency', {
    params: {
      pageSize: 10,
      pageNumber: 1,
    },
  });

  return [...data];
};
