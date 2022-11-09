import { FunctionComponent } from 'react';

import { navigation } from '@navigation';

import { Link } from '@components/Link';
import { Icon } from '@components/Icon';

import styles from './Header.module.scss';

interface HeaderProps {
  title: string;
}
export const Header: FunctionComponent<HeaderProps> = ({ title }) => (
  <header className={styles.header}>
    <Link href={navigation.app.presale.nft.list} className={styles.back}>
      <Icon name="arrow-left" size={32} fill="currentColor" />
    </Link>
    <h1 className={styles.title}>{title}</h1>
  </header>
);
