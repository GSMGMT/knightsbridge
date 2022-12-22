import { useContext, useMemo } from 'react';
import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets';
import useDarkMode from 'use-dark-mode';

import { EquitiesContext } from '@store/contexts/Equities';

import styles from './Charts.module.scss';

export const Charts = () => {
  const { pair } = useContext(EquitiesContext);

  const key = useMemo(() => pair!.stock.symbol, [pair]);

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
            autosize
            range="5D"
            interval="1"
          />
        </div>
      </div>
    </div>
  );
};
