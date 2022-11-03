import { FunctionComponent } from 'react';

import { Tokens } from './Tokens';
import { Animation } from './Animation';

import styles from './Buy.module.scss';

export const Buy: FunctionComponent = () => (
  <div className={styles.container}>
    <Animation />
    <Tokens />
  </div>
);
