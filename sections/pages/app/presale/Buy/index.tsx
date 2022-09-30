import { Action } from './Action';
import { Animation } from './Animation';

import styles from './Buy.module.scss';

export const Buy = () => (
  <div className={styles.container}>
    <Animation />
    <Action classButton="button-green" buttonText="Buy" />
  </div>
);
