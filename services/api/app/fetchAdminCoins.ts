import { api } from '@services/api';

export interface AdminPair {
  uid: string;
  source: {
    name: string;
    logo: string;
  };
  marketPairId: number;
  marketPair: string;
  logo: string;
  enabled: boolean;
}

export const fetchAdminCoins: (args?: {
  pageNumber?: number;
  search?: string;
}) => Promise<{
  pairs: Array<AdminPair>;
  totalCount: number;
}> = async (args) => {
  const { pageNumber = 1, search = '' } = args || {};

  let coins: AdminPair[] = [];

  const {
    data: {
      data: [...cryptoCurrenciesFetched],
      totalCount,
    },
  } = await api.get<{
    data: Array<{
      uid: string;
      exchange: {
        name: string;
        logo: string;
      };
      name: string;
      cmcId: number;
      price: number;
      base: {
        uid: string;
        type: string;
        name: string;
        logo: string;
      };
      quote: {
        uid: string;
        type: string;
      };
      enabled: boolean;
    }>;
    totalCount: number;
  }>('/api/marketPair', {
    params: {
      pageNumber,
      pageSize: 10,
      name: search,
    },
  });
  const cryptoCurrencies: AdminPair[] = cryptoCurrenciesFetched.map(
    ({
      uid: id,
      base: { logo },
      exchange: { ...source },
      cmcId: marketPairId,
      name: marketPair,
      enabled,
    }) =>
      ({
        uid: id,
        source,
        marketPairId,
        marketPair,
        logo,
        enabled,
      } as AdminPair)
  );

  coins = [...cryptoCurrencies];

  return { pairs: coins, totalCount };
};
