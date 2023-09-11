import { Exchange } from '@contracts/MarketStack';

import { RequestMarketStack } from '../request';

export const fetchExchange = (): RequestMarketStack<Exchange> => ({
  acronym: 'B3',
  city: 'São Paulo',
  country: 'Brazil',
  country_code: 'BR',
  currency: {
    name: 'Brazilian Real',
    symbol: 'R$',
  },
  mic: 'XBSP',
  name: 'B3 - Brazil Stock Exchange',
  pagination: {
    count: 1,
    limit: 100,
    offset: 0,
    total: 1,
  },
  timezone: {
    abbr: 'BRT',
    abbr_dst: 'BRST',
    timezone: 'America/Sao_Paulo',
  },
  website: 'http://www.b3.com.br/en_us/',
});
