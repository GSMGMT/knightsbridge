import { Request } from '@contracts/Request';

interface Source {
  name: string;
  logo: string;
  slug: string;
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
  usdQuote: number;
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
) => Promise<Response> = async () => ({
  pairsSources: [
    {
      id: 'b2d0f7e0-8e2a-4b0a-9b6e-7b6c5c6e9c1a',
      base: {
        id: 'd4a0f7e0-8e2a-4b0a-9b6e-7b6c5c6e9c1a',
        slug: 'BTC',
        type: 'CRYPTOCURRENCY',
        cmcId: 1,
        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
      },
      enabled: true,
      marketPair: 'BTC/USD',
      marketPairId: 1,
      pair: {
        id: '24a0f7e0-8e2a-4b0a-9b6e-7b6c5c6e9c1a',
        slug: 'USD',
        type: 'FIAT',
        cmcId: 2781,
        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2781.png',
      },
      price: 20000,
      source: {
        name: 'Binance',
        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
        slug: 'binance',
      },
      usdQuote: 20000,
    },
  ],
  totalCount: 1,
});
