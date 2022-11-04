import { FunctionComponent } from 'react';
import cn from 'classnames';

import { PresaleNFT as IPresale } from '@contracts/presale/nft/PresaleCoin';

import { NFT } from '@components/NFT';

import styles from './Tokens.module.scss';

export const Trending: FunctionComponent<{ items: Array<IPresale> }> = ({
  items,
}) => (
  <div className={cn(styles.box)}>
    <h2 className={styles.title}>TRENDING 🔥</h2>
    <div className={styles.tokens}>
      {items.map((item) => (
        <NFT data={item} key={item.uid} />
      ))}
    </div>
  </div>
);
