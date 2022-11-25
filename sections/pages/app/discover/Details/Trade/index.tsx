import { useCallback, useEffect, useState } from 'react';
import cn from 'classnames';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

import { Icon } from '@components/Icon';
import { Link } from '@components/Link';

import { toMoney } from '@helpers/ToMoney';
import { getValue } from '@helpers/GetValue';

import styles from './Trade.module.scss';

import { Currency as DefaultValues, PercentageChange, Quote } from '../types';

interface Currency extends DefaultValues {
  title: string;
  percentChange24h: PercentageChange;
  percentChange7d: PercentageChange;
  marketCap: number;
  volume24h: number;
}

export const Trade = () => {
  const [currencies, setCurrencies] = useState<Array<Currency>>([]);
  const [quotes, setQuotes] = useState<Array<Array<Quote>>>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuotes: () => Promise<void> = useCallback(async () => {
    try {
      // const coinsIds: string = currencies
      //   .map(({ cmcId }): number => cmcId)
      //   .toString();

      // const {
      //   data: { data: quoteData },
      // } = await api.get<QuotesFetched>(
      //   '/data-analytics/coin-market/quotes/historical',
      //   {
      //     params: {
      //       startTime: Math.floor(+subDays(new Date(), 1) / 1000),
      //       endTime: Math.floor(+new Date() / 1000),
      //       interval: '1h',
      //       id: coinsIds,
      //     },
      //   }
      // );

      // const quotesFetched: Array<Array<Quote>> = quoteData.map(
      //   ({ quotes: newQuotes }): Array<Quote> => newQuotes
      // );

      // setQuotes([...quotesFetched]);
      setQuotes([
        [
          { date: '2021-05-01', price: 1 },
          { date: '2021-05-02', price: 2 },
        ],
        [
          { date: '2021-05-01', price: 2 },
          { date: '2021-05-02', price: 1 },
        ],
        [
          { date: '2021-05-01', price: 2 },
          { date: '2021-05-02', price: 1 },
        ],
      ]);
    } catch (error: any) {}
  }, [currencies]);

  const fetchCurrencies: () => Promise<void> = useCallback(async () => {
    try {
      // const {
      //   data: { data },
      // } = await api.get('/coin/list', {
      //   params: {
      //     pageSize: 10,
      //     pageNumber: 1,
      //     coinTypes: 'COIN_MARKET',
      //   },
      // });

      // const coinsFetched: Currency[] = data.map(
      //   ({
      //     percentChange24h,
      //     percentChange7d,
      //     ...coinData
      //   }: Currency): Currency => ({
      //     ...coinData,
      //     percentChange24h: {
      //       rasing: percentChange24h.rasing,
      //       value:
      //         percentChange24h.value < 0
      //           ? percentChange24h.value * -1
      //           : percentChange24h.value,
      //     },
      //     percentChange7d: {
      //       rasing: percentChange7d.rasing,
      //       value:
      //         percentChange7d.value < 0
      //           ? percentChange7d.value * -1
      //           : percentChange7d.value,
      //     },
      //   })
      // );

      // setCurrencies([...coinsFetched]);
      setCurrencies([
        {
          cmcId: 1,
          title: 'Bitcoin',
          percentChange24h: { rasing: true, value: 1 },
          percentChange7d: { rasing: true, value: 1 },
          marketCap: 1,
          volume24h: 1,
          id: 1,
          key: 'BTC',
          logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
          price: 1,
        },
        {
          cmcId: 5426,
          title: 'Solana',
          percentChange24h: { rasing: true, value: 1 },
          percentChange7d: { rasing: true, value: 1 },
          marketCap: 5426,
          volume24h: 5426,
          id: 5426,
          key: 'SOL',
          logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png',
          price: 5426,
        },
        {
          cmcId: 1027,
          title: 'Ethereum',
          percentChange24h: { rasing: true, value: 1 },
          percentChange7d: { rasing: true, value: 1 },
          marketCap: 1027,
          volume24h: 1027,
          id: 1027,
          key: 'ETH',
          logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
          price: 1027,
        },
      ]);
    } catch (errorHandler: any) {}
  }, []);

  useEffect(() => {
    (async () => {
      await fetchCurrencies();
    })();
  }, []);

  useEffect(() => {
    const isLoading = currencies.length === 0;

    setLoading(isLoading);

    (async () => {
      if (!isLoading) await fetchQuotes();
    })();
  }, [currencies]);

  return (
    <div className={styles.trade}>
      {!loading && (
        <div className={styles.table} role="table">
          <div className={styles.row} role="row">
            <div className={styles.col}>
              <div className="sorting">#</div>
            </div>
            <div className={styles.col}>
              <div className="sorting">Name</div>
            </div>
            <div className={styles.col}>
              <div className="sorting">Price</div>
            </div>
            <div className={styles.col}>24h %</div>
            <div className={styles.col}>7d %</div>
            <div className={styles.col}>
              Marketcap <Icon name="coin" size={20} />
            </div>
            <div className={styles.col}>
              Volume (24h) <Icon name="chart" size={20} />
            </div>
            <div className={styles.col}>Chart</div>
          </div>
          {currencies.map(
            ({ percentChange24h, percentChange7d, ...currency }, index) => (
              <div className={styles.row} key={currency.key} role="row">
                <div className={styles.col}>
                  <div className={styles.line}>
                    <button
                      className={cn('favorite', styles.favorite)}
                      type="button"
                    >
                      <Icon name="star-outline" size={16} />
                    </button>
                    {index + 1}
                  </div>
                </div>
                <div className={styles.col}>
                  <div className={styles.item}>
                    <div className={styles.icon}>
                      <img src={currency.logo} alt="Coin" />
                    </div>
                    <div className={styles.details}>
                      <span className={styles.subtitle}>{currency.title}</span>
                      <span className={styles.currency}>{currency.key}</span>
                    </div>
                  </div>
                </div>
                <div className={styles.col}>
                  <div className={styles.label}>Price</div>
                  {getValue(currency.price, true)}
                </div>
                <div className={styles.col}>
                  <div className={styles.label}>24h</div>
                  <div
                    className={cn({
                      [styles.negative]: !percentChange24h.rasing,
                      [styles.positive]: percentChange24h.rasing,
                    })}
                  >
                    {getValue(percentChange24h.value)}
                  </div>
                </div>
                <div className={styles.col}>
                  <div className={styles.label}>7d</div>
                  <div
                    className={cn({
                      [styles.positive]: percentChange7d.rasing,
                      [styles.negative]: !percentChange7d.rasing,
                    })}
                  >
                    {getValue(percentChange7d.value)}
                  </div>
                </div>
                <div className={styles.col}>
                  <div className={styles.label}>Marketcap</div>
                  {toMoney(currency.marketCap)}
                </div>
                <div className={styles.col}>
                  <div className={styles.label}>Volume (24h)</div>
                  {toMoney(currency.volume24h)}
                </div>
                <div className={styles.col}>
                  <div className={styles.chart}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        width={500}
                        height={400}
                        data={quotes[index]}
                        margin={{
                          top: 3,
                          right: 0,
                          left: 0,
                          bottom: 3,
                        }}
                      >
                        <defs>
                          <linearGradient
                            id="colorPrice"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#45B36B"
                              stopOpacity={0.6}
                            />
                            <stop
                              offset="95%"
                              stopColor="#45B36B"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="price"
                          stroke="#58BD7D"
                          fillOpacity={1}
                          fill="url(#colorPrice)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <Link
                    className={cn('button-small', styles.button)}
                    href={`/exchange/${currency.id}`}
                  >
                    Buy
                  </Link>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};
