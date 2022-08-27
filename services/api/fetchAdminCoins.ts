import { api } from '@services/api';

export interface AdminPair {
  id: string;
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
      id: string;
      exchange: {
        name: string;
        logo: string;
      };
      marketPair: string;
      marketPairId: number;
      price: number;
      base: {
        name: string;
        logo: string;
      };
      baseId: string;
      baseType: string;
      quoteId: string;
      quoteType: string;
      enabled: boolean;
    }>;
    totalCount: number;
  }>('/api/crypto/market-pair/list', {
    params: {
      pageNumber,
      pageSize: 10,
      search,
    },
  });
  const cryptoCurrencies: AdminPair[] = cryptoCurrenciesFetched.map(
    ({
      id,
      base: { logo },
      exchange: { ...source },
      marketPairId,
      marketPair,
      enabled,
    }) =>
      ({
        id,
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
