import { useMemo, useState } from 'react';
import cn from 'classnames';
import Image from 'next/image';

import marketPic from '@public/images/market-pic.png';

import styles from './Main.module.scss';

const lookup = [
  { value: 1, symbol: '' },
  { value: 1e3, symbol: 'k' },
  { value: 1e6, symbol: 'M' },
  { value: 1e9, symbol: 'G' },
  { value: 1e12, symbol: 'T' },
  { value: 1e15, symbol: 'P' },
  { value: 1e18, symbol: 'E' },
];
const regex = /\.0+$|(\.[0-9]*[1-9])0+$/;

export const Main = () => {
  const [value] = useState<number>(1567328946545);

  const loading = useMemo(() => value === 0, [value]);
  const valueFormatted = useMemo(() => {
    const item = lookup
      .slice()
      .reverse()
      .find(({ value: itemValue }) => value >= itemValue);

    return item
      ? (value / item.value).toFixed(2).replace(regex, '$1') + item.symbol
      : '0';
  }, [value]);

  return (
    <div className={cn('section-mb0', styles.main)}>
      <div className={cn('container', styles.container)}>
        <div className={styles.wrap}>
          <h1 className={cn('h1', styles.title)}>
            Today’s Cryptocurrency prices
          </h1>
          <div className={styles.text}>
            The global crypto market cap is{' '}
            <strong className={cn({ [styles.loading]: loading })}>
              {loading ? '...' : `$${valueFormatted}`}
            </strong>
          </div>
        </div>
        <div className={styles.bg}>
          <Image src={marketPic} alt="Cards" />
        </div>
      </div>
    </div>
  );
};
