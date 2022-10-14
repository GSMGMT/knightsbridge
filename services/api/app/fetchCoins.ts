import { api } from '@services/api';

import { Request } from '@contracts/Request';

export interface WalletAddress {
  id: string;
  address: string;
  network: string;
}
export interface Coin {
  uid: string;
  name: string;
  symbol: string;
  slug: string;
  logo: string;
  price: number;
  walletAddresses: Array<WalletAddress>;
}
interface RequestArgs extends Omit<Request, 'startDate' | 'endDate'> {
  onlyWithAddres?: boolean;
  symbol?: string;
}
interface Response {
  coins: Coin[];
  totalCount: number;
}

export const fetchCoins: (args: RequestArgs) => Promise<Response> = async ({
  onlyWithAddres: hasAddress = false,
  ...params
}) => {
  let newCoins: Response['coins'] = [];
  let newTotalCount: Response['totalCount'] = 0;

  try {
    const {
      data: { data, totalCount },
    } = await api.get<{
      data: Response['coins'];
      totalCount: Response['totalCount'];
    }>('/api/currency', {
      params: {
        hasAddress,
        ...params,
      },
    });

    newCoins = data.map(
      ({ uid, logo, name, price, slug, symbol, walletAddresses }) =>
        ({
          uid,
          logo,
          name,
          price,
          slug,
          symbol,
          walletAddresses,
        } as Coin)
    );
    newTotalCount = totalCount;
  } catch (error) {
    console.error({ error });
  }

  return { coins: [...newCoins], totalCount: newTotalCount };
};
