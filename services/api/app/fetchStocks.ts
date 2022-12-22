import { api } from '@services/api';

import { Request } from '@contracts/Request';
import { Stock } from '@contracts/Stock';

interface RequestArgs extends Omit<Request, 'startDate' | 'endDate'> {
  symbol?: string;
}
interface Response {
  stocks: Stock[];
  totalCount: number;
}

export const fetchStocks: (args: RequestArgs) => Promise<Response> = async ({
  ...params
}) => {
  let newStocks: Response['stocks'] = [];
  let newTotalCount: Response['totalCount'] = 0;

  try {
    const {
      data: { data },
    } = await api.get<{
      data: Response['stocks'];
    }>('/api/stock', {
      params: {
        ...params,
      },
    });

    const totalCount = data.length;

    newStocks = [...data];
    newTotalCount = totalCount;
  } catch (error) {
    console.error({ error });
  }

  return { stocks: [...newStocks], totalCount: newTotalCount };
};
