import { Request } from '@contracts/Request';

export type Pairs = Array<string>;

interface RequestArgs extends Omit<Request, 'startDate' | 'endDate'> {
  cryptoId: string;
}
interface Response {
  pairs: Pairs;
  totalCount: number;
}

export const fetchPairs: (
  args: RequestArgs
) => Promise<Response> = async () => ({
  pairs: [
    'BTC/USD',
    'BTC/EUR',
    'BTC/USDT',
    'BTC/ETH',
    'BTC/BNB',
    'BTC/ADA',
  ] as Pairs,
  totalCount: 1,
});
