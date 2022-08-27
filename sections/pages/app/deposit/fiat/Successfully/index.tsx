import cn from 'classnames';

import { navigation } from '@navigation';

import { Link } from '@components/Link';

import { Request } from '..';

import styles from './Successfully.module.scss';

interface SuccessfullyProps {
  requestInfo: Request;
}
export const Successfully = ({ requestInfo }: SuccessfullyProps) => (
  <div className={styles.successfully} data-testid="success-box">
    <div className={cn('h2', styles.title)}>
      Yay!{' '}
      <span role="img" aria-label="firework">
        🎉
      </span>
    </div>
    <div className={styles.info}>
      You successfully created a deposit request{' '}
      <span data-testid="amount">
        {requestInfo.amount} {requestInfo.currency}
      </span>{' '}
      to Knightsbridge
    </div>
    <div className={styles.list}>
      <div className={styles.item}>
        <div className={styles.category}>Status</div>
        <div className={cn(styles.content, styles.status)}>Processing</div>
      </div>
      <div className={styles.item}>
        <div className={styles.category}>Transaction ID</div>
        <div className={styles.content} data-testid="id">
          {requestInfo.id}
        </div>
      </div>
      <div className={styles.item}>
        <div className={styles.category}>Deposit method</div>
        <div className={styles.content}>Bank (SWIFT)</div>
      </div>
    </div>
    <Link
      className={cn('button', styles.button)}
      href={navigation.app.discover}
    >
      Wallet
    </Link>
  </div>
);
