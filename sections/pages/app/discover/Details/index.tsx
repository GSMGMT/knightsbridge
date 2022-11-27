import cn from 'classnames';
import { FunctionComponent } from 'react';

import { CurrencyQuote } from '@contracts/Currency';

import styles from './Details.module.scss';

import { Trade } from './Trade';

interface DetailsProps {
  coins: CurrencyQuote[];
}
export const Details: FunctionComponent<DetailsProps> = ({ coins }) => (
  <div className={cn('section', styles.details)}>
    <div className={cn('container', styles.container)}>
      <Trade coins={coins} />
    </div>
  </div>
);
