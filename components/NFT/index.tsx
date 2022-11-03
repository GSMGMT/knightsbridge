import Image from 'next/image';

import nft from '@public/images/nft.png';

import styles from './NFT.module.scss';

export const NFT = () => (
  <div className={styles.container}>
    <div className={styles.banner}>
      <div className={styles.picture}>
        <Image src={nft} alt="Teste" layout="responsive" draggable={false} />
      </div>
      <div className={styles.price}>2.45 USDT</div>
    </div>
    <div className={styles.item}>
      <div className={styles.info}>
        <div className={styles.author}>Future Bright</div>
        <div className={styles.name}>Solar Power</div>
      </div>
      <div className={styles.action}>
        <button type="button" className="button-small">
          Buy Now
        </button>
        <div className={styles.sale}>
          <span className={styles.items}>11/38</span>
          <span className={styles.description}>on sale</span>
        </div>
      </div>
    </div>
  </div>
);
