import { Currency } from '@contracts/Currency';

import { api } from '@services/api';

type FiatCurrency = Omit<Currency, 'type'>;

export const fetchCurrencies: () => Promise<Array<FiatCurrency>> = async () => {
  const {
    data: { data },
  } = await api.get<{ data: Array<Currency> }>('/api/currency');

  return [...data];
};
