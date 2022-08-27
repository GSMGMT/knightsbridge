import { api } from '@services/api';

import { Request } from '@contracts/Request';

export type Pairs = Array<string>;

interface RequestArgs extends Omit<Request, 'startDate' | 'endDate'> {
  cryptoId: string;
}
interface Response {
  pairs: Pairs;
  totalCount: number;
}

export const fetchPairs: (args: RequestArgs) => Promise<Response> = async ({
  cryptoId,
  ...params
}) => {
  let newPairs: Pairs = [];
  let newTotalCount: Response['totalCount'] = 0;

  try {
    const {
      data: { data, totalCount },
    } = await api.get<{ data: Pairs; totalCount: number }>(
      `/api/crypto/${cryptoId}/market-pair/list`,
      {
        params,
      }
    );

    newPairs = [...data];
    newTotalCount = totalCount;
  } catch (error) {
    console.error({ error });
  }

  return { pairs: [...newPairs], totalCount: newTotalCount };
};
