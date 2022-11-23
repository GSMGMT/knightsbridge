import {
  FunctionComponent,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import cn from 'classnames';

import { NFTContext } from '@store/contexts/NFT';

import { NFT } from '@components/NFT';

import styles from './Tokens.module.scss';

interface NFTsProps {
  nftUid: string;
}
export const Store: FunctionComponent<NFTsProps> = ({ nftUid }) => {
  const { processing, handleBuyNFT, NFTs } = useContext(NFTContext);

  const items = useMemo(
    () => NFTs.filter(({ uid }) => uid !== nftUid),
    [nftUid, NFTs]
  );

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
      <h2 className={styles.title}>People viewing this NFT also bought</h2>
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
