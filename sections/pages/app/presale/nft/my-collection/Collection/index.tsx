import { FunctionComponent, useMemo } from 'react';
import cn from 'classnames';

import { NFT } from '@components/NFT';

import { PresaleData } from '@services/api/presale/nft/portfolio';

import styles from './Collection.module.scss';

interface UniqueAssets {
  uid: string;
  name: string;
  author: string;
  icon: string;
  quantity: number;
}

interface CollectionProps {
  assets: Array<PresaleData>;
}
export const Collection: FunctionComponent<CollectionProps> = ({ assets }) => {
  const assetsList = useMemo(() => {
    const uniqueAssets: Array<UniqueAssets> = [];

    assets.forEach((asset) => {
      const currentAsset = uniqueAssets.find(
        (item) => item.icon === asset.icon
      );

      if (currentAsset) {
        currentAsset.quantity += 1;
      } else {
        uniqueAssets.push({
          uid: asset.uid,
          name: asset.name,
          author: asset.author,
          icon: asset.icon,
          quantity: 1,
        });
      }
    });

    return uniqueAssets;
  }, [assets]);

  const assetsQuantity = useMemo(() => assetsList.length, [assetsList]);

  return (
    <div className={cn(styles.box)}>
      <h2 className={styles.title}>Collected ({assetsQuantity})</h2>
      <div className={styles.tokens}>
        {assetsList.map(({ uid, author, icon, name, quantity }) => (
          <NFT
            data={{
              author,
              icon,
              name,
              uid,
            }}
            key={uid}
            hasAction={false}
            label={{ text: quantity > 1 ? `${quantity} ITEMS` : undefined }}
          />
        ))}
      </div>
    </div>
  );
};
