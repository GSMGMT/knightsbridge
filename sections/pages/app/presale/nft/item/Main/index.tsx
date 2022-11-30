import {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import Image from 'next/image';

import { NFTContext } from '@store/contexts/NFT';

import { PresaleNFT } from '@contracts/presale/nft/PresaleCoin';

import { Counter } from '@components/Counter';

import styles from './Main.module.scss';

type MainProps = Pick<
  PresaleNFT,
  | 'uid'
  | 'amountAvailable'
  | 'icon'
  | 'name'
  | 'author'
  | 'description'
  | 'quote'
> & {
  currencySymbol: string;
};
export const Main: FunctionComponent<MainProps> = ({
  icon,
  author,
  name,
  amountAvailable,
  uid,
  description,
  currencySymbol,
  quote,
}) => {
  const { processing, handleBuyNFT } = useContext(NFTContext);

  const [amount, setAmount] = useState(0);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    setAmount(0);
  }, [uid]);

  const handleBuy = useCallback(async () => {
    if (processing) return;

    try {
      setBuying(true);

      await handleBuyNFT(uid, amount, false);
    } finally {
      setBuying(false);
    }
  }, [uid, buying, amount, processing]);

  const actionDisabled = useMemo(
    () => buying || processing || amount === 0,
    [buying, processing, amount]
  );

  return (
    <div className={styles.container}>
      <div className={styles.icon}>
        <Image src={icon} layout="fill" />
        <span className={styles.quote}>
          {quote} {currencySymbol}
        </span>
      </div>
      <div className={styles.content}>
        <div className={styles.main}>
          <h4 className={styles.author}>{author}</h4>
          <h2 className={styles.name}>{name}</h2>
        </div>
        {description && <p className={styles.description}>{description}</p>}
        <div className={styles.action}>
          <Counter
            current={amount}
            onChange={setAmount}
            max={amountAvailable}
            min={1}
          />
          <button
            className="button"
            type="button"
            onClick={handleBuy}
            disabled={actionDisabled}
          >
            {!buying ? 'Buy now' : 'Buying...'}
          </button>
        </div>
      </div>
    </div>
  );
};
