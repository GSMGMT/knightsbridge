import cn from 'classnames';
import { FunctionComponent } from 'react';

import { Icon } from '@components/Icon';
import { Link } from '@components/Link';

import { navigation } from '@navigation';

import styles from './Main.module.scss';

export const Main: FunctionComponent = () => (
  <div className={styles.main}>
    <Link href={navigation.app.presale.nft.store} className={cn(styles.button)}>
      <Icon name="arrow-left" size={32} />
    </Link>
    <h4 className={cn('h4', styles.title)}>My Collection</h4>
  </div>
);
