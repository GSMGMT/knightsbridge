import Image from 'next/image';
import { useCallback, useContext, useState } from 'react';
import toast from 'react-hot-toast';

import { NFTContext } from '@store/contexts/NFT';

import { api } from '@services/api';

import styles from './NFT.module.scss';

type IPresale = {
  uid: string;
  author: string;
  name: string;
  quote: number;
  currencySymbol: string;
  icon: string;
};

type Presale<T> = T extends true
  ? IPresale & {
      amount: number;
      amountAvailable: number;
    }
  : IPresale & {
      amount?: never;
      amountAvailable?: never;
    };
interface NFTProps<T extends boolean> {
  data: Presale<T>;
  action?: T;
}
export const NFT = <T extends boolean>({ data, action }: NFTProps<T>) => {
  const {
    author,
    name,
    currencySymbol,
    quote,
    uid,
    amount,
    amountAvailable,
    icon,
  } = data;

  const { processing, handleSetProcessing, handleFetchNFTs } =
    useContext(NFTContext);

  const [buying, setBuying] = useState<boolean>(false);

  const handleBuyNFT = useCallback(async () => {
    if (processing) return;

    try {
      setBuying(true);
      handleSetProcessing(true);

      await api.post('/api/presale/nft/order', {
        presaleNFTId: uid,
      });

      toast.success('NFT bought successfully');
    } catch (error) {
      toast.error('Something went wrong, please try again');
    } finally {
      setBuying(false);
      handleSetProcessing(false);

      await handleFetchNFTs();
    }
  }, [processing, handleSetProcessing, uid]);

  return (
    <div className={styles.container}>
      <div className={styles.banner}>
        <div className={styles.picture}>
          <Image src={icon} alt="Teste" layout="fill" draggable={false} />
        </div>
        <div className={styles.price}>
          {quote} {currencySymbol}
        </div>
      </div>
      <div className={styles.item}>
        <div className={styles.info}>
          <div className={styles.author}>{author}</div>
          <div className={styles.name}>{name}</div>
        </div>
        {action && (
          <div className={styles.action}>
            <button
              type="button"
              className="button-small"
              onClick={handleBuyNFT}
              disabled={processing}
            >
              {buying ? 'Buying...' : 'Buy Now'}
            </button>
            <div className={styles.sale}>
              <span className={styles.items}>
                {amountAvailable}/{amount}
              </span>
              <span className={styles.description}>on sale</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
NFT.defaultProps = {
  action: true,
};
