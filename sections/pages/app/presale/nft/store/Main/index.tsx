import cn from 'classnames';
import { FunctionComponent } from 'react';

import { navigation } from '@navigation';

import { Link } from '@components/Link';
import { Icon } from '@components/Icon';

import styles from './Main.module.scss';

export const Main: FunctionComponent = () => (
  <div className={styles.main}>
    <h4 className={cn('h4', styles.title)}>Digital Asset Presale</h4>
    <Link
      href={navigation.app.presale.nft.collection}
      className={cn('button-stroke button-small', styles.button)}
    >
      <span>My Colletion</span> <Icon name="arrow-right" />
    </Link>
  </div>
);
