import { api } from '@services/api';

import { Request } from '@contracts/Request';
import { StockPair } from '@contracts/StockPair';

interface StockPairPrice extends StockPair {
  price: number;
}
export type StockPairs = Array<StockPairPrice>;

interface RequestArgs extends Omit<Request, 'startDate' | 'endDate'> {
  stockId: string;
}
interface Response {
  pairs: StockPairs;
  totalCount: number;
}

export const fetchStockPairs: (
  args: RequestArgs
) => Promise<Response> = async ({ stockId, ...params }) => {
  let newPairs: StockPairs = [];
  let newTotalCount: Response['totalCount'] = 0;

  try {
    const {
      data: { data },
    } = await api.get<{ data: StockPairs }>(
      `/api/stock/${stockId}/stockPairs`,
      {
        params,
      }
    );

    const prices = await Promise.all(
      data.map(async (pair) => {
        const {
          data: { data: price },
        } = await api.get<{ data: number }>(`/api/stockPair/${pair.uid}/price`);

        return price;
      })
    );

    const totalCount = data.length;

    newPairs = data.map(
      (pair, index) =>
        ({
          ...pair,
          price: prices[index],
        } as StockPairPrice)
    );
    newTotalCount = totalCount;
  } catch (error) {
    console.error({ error });
  }

  return { pairs: [...newPairs], totalCount: newTotalCount };
};
