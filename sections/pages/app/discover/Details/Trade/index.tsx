import cn from 'classnames';
import Image from 'next/image';
import { FunctionComponent, useCallback, useMemo, useState } from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

import { CurrencyQuote } from '@contracts/Currency';

import { getValue } from '@helpers/GetValue';
import { toMoney } from '@helpers/ToMoney';

import { Icon } from '@components/Icon';
import { Link } from '@components/Link';
import { Pagination } from '@components/Pagination';

import styles from './Trade.module.scss';

interface TradeProps {
  coins: CurrencyQuote[];
}
export const Trade: FunctionComponent<TradeProps> = ({ coins }) => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const pageSize = useMemo(() => 10, []);
  const pagedItems = useMemo(
    () => coins.slice(pageSize * (pageNumber - 1), pageSize * pageNumber),
    [pageNumber, coins, pageSize]
  );
  const totalItems = useMemo(() => coins.length, [coins]);

  const handleChangePage: (newPage: number) => void = useCallback((newPage) => {
    setPageNumber(newPage);
  }, []);

  return (
    <div className={styles.trade}>
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
        {pagedItems.map((coin, index) => {
          const coinIndex = pageSize * (pageNumber - 1) + index + 1;

          return (
            <div className={styles.row} key={coin.uid} role="row">
              <div className={styles.col}>
                <div className={styles.line}>
                  <button
                    className={cn('favorite', styles.favorite)}
                    type="button"
                  >
                    <Icon name="star-outline" size={16} />
                  </button>
                  {coinIndex}
                </div>
              </div>
              <div className={styles.col}>
                <div className={styles.item}>
                  <div className={styles.icon}>
                    <Image src={coin.logo} alt="Coin" layout="fill" />
                  </div>
                  <div className={styles.details}>
                    <span className={styles.subtitle}>{coin.name}</span>
                    <span className={styles.currency}>{coin.symbol}</span>
                  </div>
                </div>
              </div>
              <div className={styles.col}>
                <div className={styles.label}>Price</div>
                {getValue(coin.price, true)}
              </div>
              <div className={styles.col}>
                <div className={styles.label}>24h</div>
                <div
                  className={cn({
                    [styles.negative]: !coin.percentChange['24h'].rasing,
                    [styles.positive]: coin.percentChange['24h'].rasing,
                  })}
                >
                  {getValue(coin.percentChange['24h'].value)}
                </div>
              </div>
              <div className={styles.col}>
                <div className={styles.label}>7d</div>
                <div
                  className={cn({
                    [styles.positive]: coin.percentChange['7d'].rasing,
                    [styles.negative]: !coin.percentChange['7d'].rasing,
                  })}
                >
                  {getValue(coin.percentChange['7d'].value)}
                </div>
              </div>
              <div className={styles.col}>
                <div className={styles.label}>Marketcap</div>
                {toMoney(coin.marketCap)}
              </div>
              <div className={styles.col}>
                <div className={styles.label}>Volume (24h)</div>
                {toMoney(coin.volume24h)}
              </div>
              <div className={styles.col}>
                <div className={styles.chart}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      width={500}
                      height={400}
                      data={coin.quotes}
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
                  href={`/exchange/${coin.symbol}`}
                >
                  Buy
                </Link>
              </div>
            </div>
          );
        })}
      </div>
      <div className={styles['pagination-area']}>
        <div className={styles['pagination-label']}>
          Showing ({pagedItems.length}) of {totalItems}
        </div>
        <Pagination
          currentPage={pageNumber}
          handleChangePage={handleChangePage}
          pageSize={pageSize}
          totalItems={totalItems}
          siblingCount={0}
        />
      </div>
    </div>
  );
};
