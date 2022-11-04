import { FunctionComponent } from 'react';

import { PresaleNFT } from '@contracts/presale/nft/PresaleCoin';

import { Tokens } from './Tokens';
import { Animation } from './Animation';

import styles from './Buy.module.scss';

export const Buy: FunctionComponent<{
  items: Array<PresaleNFT>;
}> = ({ items }) => (
  <div className={styles.container}>
    <Animation />
    <Tokens items={items} />
  </div>
);
