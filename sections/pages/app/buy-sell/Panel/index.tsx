import styles from './Panel.module.scss';

import { Charts } from '../Charts';
import { BidAndAsk } from '../BidAndAsk';

export const Panel = () => (
  <div className={styles.panel}>
    <BidAndAsk />
    <Charts />
  </div>
);
