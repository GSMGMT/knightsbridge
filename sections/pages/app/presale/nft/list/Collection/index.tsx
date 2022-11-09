import { FunctionComponent } from 'react';
import cn from 'classnames';

import { navigation } from '@navigation';

import { NFT } from '@components/NFT';
import { Link } from '@components/Link';

import { PresaleNFT as IPresale } from '@contracts/presale/nft/PresaleCoin';

import styles from './Collection.module.scss';

interface CollectionProps {
  items: IPresale[];
}
export const Collection: FunctionComponent<CollectionProps> = ({ items }) => (
  <div className={styles.tokens}>
    {items.map(({ amount, amountAvailable, author, icon, name, uid }) => (
      <NFT
        data={{ amount, amountAvailable, author, icon, name, uid }}
        key={uid}
        action={
          <Link
            href={navigation.app.presale.nft.history + uid}
            className={cn(
              'button-small button-stroke',
              styles['button-action']
            )}
          >
            View
          </Link>
        }
      />
    ))}
  </div>
);
