import { api } from '@services/api';

import { Request } from '@contracts/Request';

interface Source {
  name: string;
  logo: string;
}
interface Coin {
  id: string;
  slug: string;
  type: 'FIAT' | 'CRYPTOCURRENCY';
  logo?: string;
  cmcId?: number;
}
export interface PairSource {
  id: string;
  price: number;
  marketPair: string;
  marketPairId: number;
  base: Coin;
  pair: Coin;
  source: Source;
  enabled: boolean;
}
export type PairsSources = Array<PairSource>;

type RequestArgs = Omit<Request, 'startDate' | 'endDate'>;
interface Response {
  pairsSources: PairsSources;
  totalCount: number;
}

export const fetchPairsSources: (
  args: RequestArgs
) => Promise<Response> = async ({ ...params }) => {
  let newPairsSources: PairsSources = [];
  let newTotalCount: Response['totalCount'] = 0;

  try {
    const {
      data: { data, totalCount },
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
          cmcId?: number;
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
      params,
    });

    newPairsSources = data.map(
      ({
        id,
        base: { name, cmcId, logo },
        exchange: { ...source },
        marketPairId,
        marketPair,
        baseId,
        baseType,
        quoteId: pairId,
        quoteType: pairType,
        price,
        enabled,
      }) => {
        const [baseSlug, pairSlug] = marketPair.split('/');

        return {
          id,
          marketPair: name,
          source,
          marketPairId,
          price,
          base: {
            id: baseId,
            slug: baseSlug,
            type: baseType === 'FIAT' ? 'FIAT' : 'CRYPTOCURRENCY',
            logo,
            cmcId,
          },
          pair: {
            id: pairId,
            slug: pairSlug,
            type: pairType === 'FIAT' ? 'FIAT' : 'CRYPTOCURRENCY',
          },
          enabled,
        } as PairSource;
      }
    );
    newTotalCount = totalCount;
  } catch (error) {
    console.error({ error });
  }

  return { pairsSources: [...newPairsSources], totalCount: newTotalCount };
};
