import Image from 'next/image';
import { FunctionComponent } from 'react';

import { PresaleNFT } from '@contracts/presale/nft/PresaleCoin';

import nft from '@public/images/nft.png';

import styles from './NFT.module.scss';

export const NFT: FunctionComponent<{ data: PresaleNFT }> = ({
  data: {
    amount,
    amountAvailable,
    author,
    name,
    baseCurrency: { symbol },
    quote,
  },
}) => (
  <div className={styles.container}>
    <div className={styles.banner}>
      <div className={styles.picture}>
        <Image src={nft} alt="Teste" layout="responsive" draggable={false} />
      </div>
      <div className={styles.price}>
        {quote} {symbol}
      </div>
    </div>
    <div className={styles.item}>
      <div className={styles.info}>
        <div className={styles.author}>{author}</div>
        <div className={styles.name}>{name}</div>
      </div>
      <div className={styles.action}>
        <button type="button" className="button-small">
          Buy Now
        </button>
        <div className={styles.sale}>
          <span className={styles.items}>
            {amount}/{amountAvailable}
          </span>
          <span className={styles.description}>on sale</span>
        </div>
      </div>
    </div>
  </div>
);
