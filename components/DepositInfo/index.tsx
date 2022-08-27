import cn from 'classnames';

import { Icon } from '../Icon';

import { useCopy } from '../../hooks/Copy';

import styles from './DepositInfo.module.scss';

import {
  Coin as PairedCoin,
  WalletAddress,
} from '../../services/api/fetchCoins';

type Coin = Pick<PairedCoin, 'id' | 'logo' | 'name' | 'symbol' | 'price'>;

interface DepositInfoProps {
  coin: Coin;
  networkAddress: WalletAddress;
  amount: number;
}
export const DepositInfo = ({
  coin,
  networkAddress,
  amount,
}: DepositInfoProps) => {
  const { handleElementCopy: handleCopy } = useCopy();

  return (
    <div className={styles.content}>
      <p className={styles.info}>
        You are about to deposit {amount} {coin.symbol} to Knights Exchange.
      </p>
      <div className={styles.transaction}>
        <div className={styles.details}>
          <div className={styles.detail}>
            <div className={cn(styles.icon, styles.amount)}>
              <Icon name="wallet" fill="currentColor" size={20} />
            </div>
            <div className={styles.data}>
              <span className={styles.title}>Depositing</span>
              <span className={styles.value}>
                {amount} {coin.symbol}
              </span>
            </div>
          </div>
          <div className={styles.detail}>
            <div className={cn(styles.icon, styles.network)}>
              <Icon name="wallet" fill="currentColor" size={20} />
            </div>
            <div className={styles.data}>
              <span className={styles.title}>Using network</span>
              <span className={styles.value}>{networkAddress.network}</span>
            </div>
          </div>
        </div>
        <div className={styles.text}>
          <p className={styles.description}>
            Only send {coin.symbol} to this address. Sending any other asset to
            this address may result in the loss of your deposit!
          </p>
        </div>
        <div className={styles['address-area']}>
          <div className={cn(styles.address)}>{networkAddress.address}</div>
          <button className={styles.copy} type="button" onClick={handleCopy}>
            <Icon name="copy" size={24} fill="currentColor" />
          </button>
        </div>
        <div className={styles.text}>
          <p className={styles.network}>
            {coin.symbol}/{networkAddress.network} deposits are available after
            12 network confirmations.
          </p>
          <p className={styles.network}>
            Please be sure that the contract address is related to the tokens
            that you are depositing.
          </p>
        </div>
      </div>
      <p className={styles.info}>To complete, insert your transaction hash.</p>
    </div>
  );
};
