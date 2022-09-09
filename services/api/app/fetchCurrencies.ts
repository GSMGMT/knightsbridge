import { Currency } from '@contracts/Currency';

import { api } from '@services/api';

type FiatCurrency = Omit<Currency, 'type'>;

export const fetchCurrencies: (params?: {
  [key: string]: string;
}) => Promise<Array<FiatCurrency>> = async (params) => {
  const {
    data: { data },
  } = await api.get<{ data: Array<Currency> }>('/api/currency', { params });

  return [...data];
};
