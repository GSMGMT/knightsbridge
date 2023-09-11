import { FunctionComponent } from 'react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { format } from 'date-fns';

import { Main } from '@sections/pages/app/discover/Main';
import { Details } from '@sections/pages/app/discover/Details';

import { withUser } from '@middlewares/client/withUser';

import { CurrencyQuote } from '@contracts/Currency';

export const getServerSideProps = (ctx: GetServerSidePropsContext) =>
  withUser<{
    coins: CurrencyQuote[];
  }>(
    ctx,
    {
      freeToAccessBy: 'BOTH',
    },
    async () => {
      const coins = [
        {
          cmcId: 1,
          logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
          uid: 'baa1b2e0-5b9a-11eb-ae93-0242ac130002',
          symbol: 'BTC',
          price: 20000,
          marketCap: 171237486,
          name: 'Bitcoin',
          percentChange: {
            '24h': {
              value: 0.1,
              rasing: true,
            },
            '7d': {
              value: 0.1,
              rasing: false,
            },
          },
          volume24h: 171237486,
          quotes: [
            {
              date: format(new Date(), 'yyyy-MM-dd'),
              price: 20000,
            },
          ],
        } as CurrencyQuote,
      ].sort(({ price: a }, { price: b }) => b - a);

      return {
        props: {
          coins,
        },
      };
    }
  );
const Discover: FunctionComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ coins }) => (
  <div>
    <Main />
    <Details coins={coins} />
  </div>
);
export default Discover;
