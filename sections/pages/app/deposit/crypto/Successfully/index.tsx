import cn from 'classnames';

import { navigation } from '@navigation';

import { Link } from '@components/Link';
import { Modal } from '@components/Modal';

import { Coin, Address } from '../types';

import styles from './Successfully.module.scss';

export interface DepositInfo {
  uid: string;
  hash: string;
}
interface SuccessfullyProps {
  coin: Coin;
  walletAddress: Address;
  depositInfo: DepositInfo;
  amount: number;
  visible: boolean;
  handleClose: () => void;
}
export const Successfully = ({
  coin,
  amount,
  handleClose,
  visible,
  depositInfo,
  walletAddress,
}: SuccessfullyProps) => (
  <Modal onClose={handleClose} visible={visible}>
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
          {amount} {coin.symbol}
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
          <div
            className={styles.content}
            data-testid="id"
            title={depositInfo.uid}
          >
            {depositInfo.uid}
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.category}>Deposit crypto</div>
          <div className={styles.content}>{coin.symbol}</div>
        </div>
        <div className={styles.item}>
          <div className={styles.category}>Network</div>
          <div className={styles.content}>{walletAddress.network}</div>
        </div>
        <div className={styles.item}>
          <div className={styles.category}>Amount</div>
          <div className={styles.content}>{amount}</div>
        </div>
        <div className={styles.item}>
          <div className={styles.category}>Transaction hash</div>
          <div className={styles.content}>{depositInfo.hash}</div>
        </div>
      </div>

      <div className={styles.btns}>
        <Link
          className={cn('button', 'button-stroke', styles.button)}
          href={navigation.app.buySell}
        >
          Trade
        </Link>
        <Link
          className={cn('button', styles.button)}
          href={navigation.app.wallet}
        >
          Wallet
        </Link>
      </div>
    </div>
  </Modal>
);
