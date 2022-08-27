import cn from 'classnames';

import styles from '../Navigation.module.scss';

import { INavigation } from '../..';

import { Dropdown } from '../../Dropdown';
import { NavLink } from '../../../NavLink';

const navigation: INavigation[] = [
  {
    title: 'Dashboard',
    url: '/dashboard',
  },
  {
    title: 'Trades',
    url: '/orders/buy-sell',
  },
  {
    title: 'Deposits',
    dropdown: [
      {
        title: 'Fiat',
        icon: 'image',
        url: '/orders/fiat',
      },
      {
        title: 'Crypto',
        icon: 'coin',
        url: '/orders/crypto',
      },
    ],
  },
  {
    title: 'Coins',
    url: '/coins/list',
  },
];

interface AdminNavigationProps {
  setVisibleNav: (visible: boolean) => void;
}
export const AdminNavigation = ({ setVisibleNav }: AdminNavigationProps) => (
  <nav className={styles.nav}>
    {navigation.map((item) =>
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
