import cn from 'classnames';
import { FunctionComponent } from 'react';

import styles from './Main.module.scss';

export const Main: FunctionComponent = () => (
  <div className={styles.main}>
    <h4 className={cn('h4', styles.title)}>NFT Presale</h4>
  </div>
);
