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

type RequestArgs = Omit<Request, 'startDate' | 'endDate'> & {
  name?: string;
};
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
        uid: string;
        exchange: {
          name: string;
          logo: string;
        };
        name: string;
        cmcId: number;
        base: {
          name: string;
          cmcId?: number;
          logo: string;
          uid: string;
          type: string;
        };
        quote: {
          uid: string;
          type: string;
        };
        enabled: boolean;
      }>;
      totalCount: number;
    }>('/api/marketPair', {
      params,
    });

    const prices = await Promise.all(
      data.map(async (pair) => {
        const price = await api.get<{ data: number }>(
          `/api/marketPair/${pair.uid}/price`
        );

        return price.data.data;
      })
    );

    newPairsSources = data.map(
      (
        {
          uid: id,
          base: { name, cmcId, logo, uid: baseId, type: baseType },
          exchange: { ...source },
          cmcId: marketPairId,
          name: marketPair,
          quote: { uid: pairId, type: pairType },
          enabled,
        },
        index
      ) => {
        const [baseSlug, pairSlug] = marketPair.split('/');

        return {
          id,
          marketPair: name,
          source,
          marketPairId,
          price: prices[index],
          base: {
            id: baseId,
            slug: baseSlug,
            type: baseType === 'fiat' ? 'FIAT' : 'CRYPTOCURRENCY',
            logo,
            cmcId,
          },
          pair: {
            id: pairId,
            slug: pairSlug,
            type: pairType === 'fiat' ? 'FIAT' : 'CRYPTOCURRENCY',
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
