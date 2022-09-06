import cn from 'classnames';

import { navigation } from '@navigation';

import styles from '../Navigation.module.scss';

import { INavigation } from '../..';

import { Dropdown } from '../../Dropdown';
import { NavLink } from '../../../NavLink';

const navigationItems: INavigation[] = [
  {
    title: 'Dashboard',
    url: navigation.app.discover,
  },
  {
    title: 'Trades',
    url: navigation.soon,
  },
  {
    title: 'Deposits',
    dropdown: [
      {
        title: 'Fiat',
        icon: 'image',
        url: navigation.app.orders.fiat,
      },
      {
        title: 'Crypto',
        icon: 'coin',
        url: navigation.soon,
      },
    ],
  },
  {
    title: 'Coins',
    url: navigation.app.coin.list,
  },
];

interface AdminNavigationProps {
  setVisibleNav: (visible: boolean) => void;
}
export const AdminNavigation = ({ setVisibleNav }: AdminNavigationProps) => (
  <nav className={styles.nav}>
    {navigationItems.map((item) =>
      item.dropdown ? (
        <Dropdown
          className={styles.dropdown}
          key={item.title}
          title={item.title}
          items={item.dropdown}
          setValue={setVisibleNav}
        />
      ) : (
        <NavLink
          className={({ isActive: active }) =>
            cn(styles.item, { [styles.active]: active })
          }
          onClick={() => setVisibleNav(false)}
          href={item.url!}
          key={item.title}
        >
          {item.title}
        </NavLink>
      )
    )}
  </nav>
);
