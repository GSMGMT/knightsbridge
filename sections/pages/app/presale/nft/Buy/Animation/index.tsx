import Transaction from '@public/images/nfts.svg';

import styles from './Animation.module.scss';

export const Animation = () => (
  <div className={styles.container}>
    <h2 className={styles.title}>Get ready to buy extraordinary NFTs</h2>
    <div className={styles.description}>
      <p>
        It's time to buy your NFT before launch, get it in advance. At the
        moment we only accept USDT.
      </p>
    </div>
    <div className={styles.ilustration}>
      <Transaction className={styles.illustration} />
    </div>
  </div>
);
