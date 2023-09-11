import { Request } from '@contracts/Request';
import { Stock } from '@contracts/Stock';

interface RequestArgs extends Omit<Request, 'startDate' | 'endDate'> {
  symbol?: string;
}
interface Response {
  stocks: Stock[];
  totalCount: number;
}

export const fetchStocks: (
  args: RequestArgs
) => Promise<Response> = async () => ({
  stocks: [],
  totalCount: 0,
});
