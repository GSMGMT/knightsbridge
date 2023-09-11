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

export const fetchCoins: (
  args: RequestArgs
) => Promise<Response> = async () => ({
  coins: [
    {
      logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
      name: 'Bitcoin',
      symbol: 'BTC',
      uid: 'b2d0f7e0-8e2a-4b0a-9b6e-7b6c5c6e9c1a',
      walletAddresses: [
        {
          address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
          network: 'BTC',
        },
      ],
      price: 20000,
      slug: 'bitcoin',
    },
  ] as Coin[],
  totalCount: 1,
});
