import { FunctionComponent } from 'react';

import { Coin } from '@pages/app/presale/coin';

import { Action } from './Action';
import { Animation } from './Animation';

import styles from './Buy.module.scss';

interface BuyProps {
  coins: Coin[];
  handleFetchPorfolio: () => Promise<void>;
  handleFetchCoins: () => Promise<void>;
}
export const Buy: FunctionComponent<BuyProps> = ({
  coins,
  handleFetchPorfolio,
  handleFetchCoins,
}) => (
  <div className={styles.container}>
    <Animation />
    <Action
      coins={coins}
      handleFetchPorfolio={handleFetchPorfolio}
      handleFetchCoins={handleFetchCoins}
    />
  </div>
);
