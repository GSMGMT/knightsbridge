import cn from 'classnames';

import styles from './Details.module.scss';

import { Trade } from './Trade';

export const Details = () => (
  <div className={cn('section', styles.details)}>
    <div className={cn('container', styles.container)}>
      <Trade />
    </div>
  </div>
);
