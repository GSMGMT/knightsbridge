import { FunctionComponent } from 'react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { format } from 'date-fns';

import { Main } from '@sections/pages/app/discover/Main';
import { Details } from '@sections/pages/app/discover/Details';

import { fetchCryptoById } from '@services/api/coinMarketCap/crypto/fetchCryptoById';
import { fetchHistoricalQuoteById } from '@services/api/coinMarketCap/crypto/fetchHistoricalQuoteById';

import { withUser } from '@middlewares/client/withUser';

import listCurrencies from '@libs/firebase/functions/currency/listCurrencies';

import { CurrencyQuote, Quote, Quotes } from '@contracts/Currency';

export const getServerSideProps = (ctx: GetServerSidePropsContext) =>
  withUser<{
    coins: CurrencyQuote[];
  }>(
    ctx,
    {
      freeToAccessBy: 'BOTH',
    },
    async () => {
      const currencyList = await listCurrencies({
        filters: { type: 'crypto' },
      });
      const currencyIds: number[] = [];
      currencyList.forEach(({ cmcId }) => {
        const currencyAlreadyExists = currencyIds.includes(cmcId);

        if (!currencyAlreadyExists) {
          currencyIds.push(cmcId);
        }
      });
      const fetchCrypto = fetchCryptoById(currencyIds);

      const fetchQuote = [];
      for (const cmcId of currencyIds) {
        fetchQuote.push(fetchHistoricalQuoteById(String(cmcId)));
      }

      const [{ data: cryptoData }, quotesData] = await Promise.all([
        fetchCrypto,
        Promise.all(fetchQuote),
      ]);

      const coins = currencyIds
        .map((cmcId, index) => {
          const { logo, uid, symbol, name } = currencyList.find(
            (currency) => currency.cmcId === cmcId
          )!;

          const {
            price,
            market_cap: marketCap,
            percent_change_24h: change24h,
            percent_change_7d: change7d,
            volume_24h: volume24h,
          } = cryptoData[cmcId].quote!.USD;

          const quotes: Quotes = quotesData[index].data.quotes!.map(
            ({
              quote: {
                USD: { high: quotePrice },
              },
              time_close,
            }) => {
              const date = format(new Date(time_close), 'yyyy-MM-dd');

              return {
                date,
                price: quotePrice,
              } as Quote;
            }
          );

          return {
            cmcId,
            logo,
            uid,
            symbol,
            price,
            marketCap,
            name,
            percentChange: {
              '24h': {
                value: change24h < 0 ? change24h * -1 : change24h,
                rasing: change24h > 0,
              },
              '7d': {
                value: change7d < 0 ? change7d * -1 : change7d,
                rasing: change7d > 0,
              },
            },
            volume24h,
            quotes,
          } as CurrencyQuote;
        })
        .sort(({ price: a }, { price: b }) => b - a);

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
