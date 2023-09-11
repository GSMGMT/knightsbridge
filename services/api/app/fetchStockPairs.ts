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
) => Promise<Response> = async () => ({
  pairs: [],
  totalCount: 0,
});
