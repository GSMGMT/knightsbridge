import { Currency } from '@contracts/Currency';

type FiatCurrency = Omit<Currency, 'type'>;

export const fetchCurrencies: (params?: {
  [key: string]: string;
}) => Promise<Array<FiatCurrency>> = async () =>
  [
    {
      cmcId: 1,
      createdAt: new Date(),
      logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
      name: 'Bitcoin',
      symbol: 'BTC',
      uid: 'b2d0f7e0-8e2a-4b0a-9b6e-7b6c5c6e9c1a',
      updatedAt: new Date(),
      deposit: true,
      quote: 20000,
      sign: '$',
      walletAddresses: [
        {
          address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
          createdAt: new Date(),
          network: 'BTC',
          uid: 'e2d0f7e0-8e2a-4b0a-9b6e-7b6c5c6e9c1a',
          updatedAt: new Date(),
        },
      ],
    },
  ] as Array<FiatCurrency>;
