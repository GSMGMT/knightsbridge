import { useCallback, useEffect, useState } from 'react';
import cn from 'classnames';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

import { Dropdown } from '@components/Dropdown';
import { Link } from '@components/Link';

import { getValue } from '@helpers/GetValue';

import styles from './Panel.module.scss';

import { PercentageChange, Quote, Currency as DefaultValues } from '../types';

const navigation: Array<string> = [
  'Trending 🔥',
  'Top Gainers',
  'Recenty Added',
];

interface Currency extends DefaultValues {
  percentChange: PercentageChange;
}

interface PanelProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}
export const Panel = ({ loading, setLoading }: PanelProps) => {
  const [currencies, setCurrencies] = useState<Array<Currency>>([]);
  const [quotes, setQuotes] = useState<Array<Array<Quote>>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [sorting, setSorting] = useState(navigation[0]);

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
      //     params: { ...defaultParams, id: coinsIds },
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
      // } = await api.get('/coin/list/trending', {
      //   params: {
      //     ...defaultParams,
      //     pageSize: 3,
      //   },
      // });

      // const coinsFetched: Currency[] = data.map(
      //   ({ ...coinData }: Currency): Currency => ({
      //     ...coinData,
      //   })
      // );

      // setCurrencies([...coinsFetched]);
      setCurrencies([
        {
          cmcId: 1,
          id: 1,
          key: 'BTC',
          price: 1,
          logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
          percentChange: {
            rasing: true,
            value: 0.251233214,
          },
        },
        {
          cmcId: 5426,
          id: 5426,
          key: 'SOL',
          price: 5426,
          logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png',
          percentChange: {
            rasing: false,
            value: 51.12345,
          },
        },
        {
          cmcId: 1027,
          id: 1027,
          key: 'ETH',
          price: 1027,
          logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
          percentChange: {
            rasing: false,
            value: 12.4124123,
          },
        },
      ]);
    } catch (error: any) {}
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
    <div className={cn(styles.panel, { [styles.loading]: loading })}>
      {!loading && (
        <>
          <div className={styles.body}>
            <div className={styles.list}>
              {currencies.map(({ percentChange, ...currency }, index) => (
                <Link
                  className={styles.item}
                  key={currency.key}
                  href={`/exchange/${currency.id}`}
                >
                  <div className={styles.icon}>
                    <img src={currency.logo} alt="Currency" />
                  </div>
                  <div className={styles.details}>
                    <div className={styles.line}>
                      <div className={styles.title}>{currency.key}/USDT</div>
                      <div
                        className={cn({
                          [styles.negative]: !percentChange.rasing,
                          [styles.positive]: percentChange.rasing,
                        })}
                      >
                        {percentChange.value.toFixed(2)}
                      </div>
                    </div>
                    <div className={styles.price}>
                      {getValue(currency.price)}
                    </div>
                    <div className={styles.currency}>{getValue(0)}</div>
                  </div>
                  <div className={styles.chart}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        width={500}
                        height={400}
                        data={quotes[index]}
                        margin={{
                          top: 0,
                          right: 0,
                          left: 0,
                          bottom: 0,
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
                </Link>
              ))}
            </div>
          </div>
          <div className={styles.foot}>
            <div className={styles.nav}>
              {navigation.map((x, index) => (
                <button
                  className={cn(styles.link, {
                    [styles.active]: index === activeIndex,
                  })}
                  onClick={() => setActiveIndex(index)}
                  key={x}
                  type="button"
                >
                  {x}
                </button>
              ))}
            </div>
            <Link
              className={cn('button-stroke button-small', styles.button)}
              href="/exchange"
            >
              Trade
            </Link>
            <Dropdown
              className={styles.dropdown}
              value={sorting}
              setValue={setSorting}
              options={navigation}
            />
          </div>
        </>
      )}
    </div>
  );
};
