import Transaction from '@public/images/transactions.svg';

import styles from './Animation.module.scss';

export const Animation = () => (
  <div className={styles.container}>
    <h2 className={styles.title}>Buy Presale Projects</h2>
    <div className={styles.description}>
      <p>We strongly believe in these projects.</p>
      <p>
        At the moment we only accept USDT for the acquisition of presale tokens.
      </p>
    </div>
    <div className={styles.ilustration}>
      <Transaction className={styles.illustration} />
    </div>
  </div>
);
