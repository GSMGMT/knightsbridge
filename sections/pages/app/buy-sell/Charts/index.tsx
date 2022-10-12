import { useContext, useMemo } from 'react';
import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets';
import useDarkMode from 'use-dark-mode';

import { ExchangeContext } from '@store/contexts/Exchange';

import { navigation } from '@navigation';

import styles from './Charts.module.scss';

export const Charts = () => {
  const { pair } = useContext(ExchangeContext);

  const baseSlug = useMemo(() => pair!.base.slug, [pair]);
  const pairSlug = useMemo(() => pair!.pair.slug, [pair]);

  const key = useMemo(() => `${baseSlug}${pairSlug}`, [baseSlug, pairSlug]);

  const darkMode = useDarkMode(false);

  return (
    <div className={styles.charts}>
      <div className={styles.inner}>
        <div className={styles.iframe}>
          {baseSlug === 'FBX' ? (
            <iframe
              title="FBX Chart"
              src={`${navigation.resources.chart}?theme=${
                darkMode.value ? 'dark' : 'light'
              }`}
              className={styles['iframe-chart']}
            />
          ) : (
            <AdvancedRealTimeChart
              symbol={key}
              container_id="tradingview_081c5"
              hide_side_toolbar
              hide_top_toolbar
              theme={darkMode.value ? 'dark' : 'light'}
              autosize
              range="5D"
              interval="1"
            />
          )}
        </div>
      </div>
    </div>
  );
};
