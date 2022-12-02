import cn from 'classnames';

import { navigation } from '@navigation';

import { Link } from '@components/Link';

import { Source, Stock } from '@contracts/Equity';

import styles from './Successfully.module.scss';

interface SuccessfullyProps {
  stockRegistered: Stock;
  sourceRegistered: Source;
}
export const Successfully = ({
  sourceRegistered,
  stockRegistered,
}: SuccessfullyProps) => (
  <div className={styles.successfully} data-testid="success-box">
    <div className={cn('h2', styles.title)}>
      Yay!{' '}
      <span role="img" aria-label="firework">
        🎉
      </span>
    </div>
    <div className={styles.info}>You successfully register a equity!</div>
    <div className={styles.list}>
      <div className={styles.item}>
        <div className={styles.category}>Equity Name</div>
        <div className={cn(styles.content)}>{stockRegistered.name}</div>
      </div>
      <div className={styles.item}>
        <div className={styles.category}>Market</div>
        <div className={styles.content} data-testid="id">
          {sourceRegistered.name}
        </div>
      </div>
    </div>
    <Link
      className={cn('button', styles.button)}
      href={navigation.app.equities.list}
    >
      Equity List
    </Link>
  </div>
);
