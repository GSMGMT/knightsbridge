import { Currency } from '@contracts/Currency';
import { api } from '@services/api';

interface RequestArgs {
  size?: number;
}
interface Response {
  coins: Currency[];
}

export const fetchAddress: (args: RequestArgs) => Promise<Response> = async ({
  ...params
}) => {
  let newCoins: Response['coins'] = [];

  try {
    const {
      data: { data },
    } = await api.get<{
      data: Response['coins'];
    }>('/api/currency/address', {
      params: {
        ...params,
      },
    });

    newCoins = [...data];
  } catch (error) {
    console.error({ error });
  }

  return { coins: [...newCoins] };
};
