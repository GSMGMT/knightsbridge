import { FunctionComponent } from 'react';
import cn from 'classnames';

import { NFT } from '@components/NFT';

import styles from './Tokens.module.scss';

export const Tokens: FunctionComponent = () => (
  <div className={cn(styles.box)}>
    <h2 className={styles.title}>NEWESTS</h2>
    <div className={styles.tokens}>
      <NFT />
      <NFT />
      <NFT />
    </div>
  </div>
);
