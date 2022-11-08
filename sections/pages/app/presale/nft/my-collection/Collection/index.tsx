import { FunctionComponent, useMemo } from 'react';
import cn from 'classnames';

import { NFT } from '@components/NFT';

import { PresaleData } from '@services/api/presale/nft/portfolio';

import styles from './Collection.module.scss';

interface CollectionProps {
  assets: Array<PresaleData>;
}
export const Collection: FunctionComponent<CollectionProps> = ({ assets }) => {
  const assetsQuantity = useMemo(() => assets.length, [assets]);

  return (
    <div className={cn(styles.box)}>
      <h2 className={styles.title}>Collected ({assetsQuantity})</h2>
      <div className={styles.tokens}>
        {assets.map(
          ({
            uid,
            author,
            baseCurrency: currencySymbol,
            icon,
            name,
            quote,
          }) => (
            <NFT
              data={{
                author,
                currencySymbol,
                icon,
                name,
                quote,
                uid,
              }}
              key={uid}
              action={false}
            />
          )
        )}
      </div>
    </div>
  );
};
