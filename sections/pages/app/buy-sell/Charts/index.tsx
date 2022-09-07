import { useContext, useMemo } from 'react';
import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets';
import useDarkMode from 'use-dark-mode';

import { ExchangeContext } from '@store/contexts/Exchange';

import styles from './Charts.module.scss';

export const Charts = () => {
  const { pair } = useContext(ExchangeContext);

  const key = useMemo(() => {
    const {
      base: { slug: baseSlug },
      pair: { slug: pairSlug },
    } = pair!;

    return `${baseSlug}${pairSlug}`;
  }, [pair]);

  const darkMode = useDarkMode(false);

  return (
    <div className={styles.charts}>
      <div className={styles.inner}>
        <div className={styles.iframe}>
          <AdvancedRealTimeChart
            symbol={key}
            container_id="tradingview_081c5"
            hide_side_toolbar
            hide_top_toolbar
            theme={darkMode.value ? 'dark' : 'light'}
            // style="1"
            autosize
            range="5D"
            interval="1"
            // widgetPropsAny={{
            //   studies: ['Volume@tv-basicstudies'],
            // }}
          />
        </div>
      </div>
    </div>
  );
};
