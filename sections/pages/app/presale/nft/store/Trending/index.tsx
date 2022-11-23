import { FunctionComponent, useCallback, useContext, useState } from 'react';
import cn from 'classnames';

import { PresaleNFT as IPresale } from '@contracts/presale/nft/PresaleCoin';

import { NFTContext } from '@store/contexts/NFT';

import { NFT } from '@components/NFT';

import styles from './Tokens.module.scss';

export const Trending: FunctionComponent<{ items: Array<IPresale> }> = ({
  items,
}) => {
  const { processing, handleBuyNFT } = useContext(NFTContext);

  const [buying, setBuying] = useState('');

  const handleBuy = useCallback(
    async (uid: string) => {
      if (processing) return;

      try {
        setBuying(uid);

        await handleBuyNFT(uid);
      } finally {
        setBuying('');
      }
    },
    [processing]
  );

  return (
    <div className={cn(styles.box)}>
      <h2 className={styles.title}>TRENDING 🔥</h2>
      <div className={styles.tokens}>
        {items.map(({ baseCurrency: { symbol: currencySymbol }, ...item }) => (
          <NFT
            data={{
              ...item,
            }}
            key={item.uid}
            label={{
              text: `${item.quote} ${currencySymbol}`,
            }}
            action={
              <button
                type="button"
                className="button-small order-1"
                onClick={(event) => {
                  event.preventDefault();

                  return handleBuy(item.uid);
                }}
                disabled={processing}
              >
                {buying === item.uid ? 'Buying...' : 'Buy Now'}
              </button>
            }
          />
        ))}
      </div>
    </div>
  );
};
