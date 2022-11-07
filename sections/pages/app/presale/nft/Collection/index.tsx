import { FunctionComponent, useContext, useMemo } from 'react';
import cn from 'classnames';

import { NFTContext } from '@store/contexts/NFT';

import { NFT } from '@components/NFT';

import styles from './Collection.module.scss';

export const Collection: FunctionComponent = () => {
  const { assets } = useContext(NFTContext);

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
