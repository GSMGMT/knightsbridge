import cn from 'classnames';

import { navigation } from '@navigation';

import styles from '../Navigation.module.scss';

import { INavigation } from '../..';

import { Dropdown } from '../../Dropdown';
import { NavLink } from '../../../NavLink';

const navigationItems: INavigation[] = [
  {
    title: 'Trade',
    url: '/app',
  },
  {
    title: 'Deposit',
    dropdown: [
      {
        title: 'Fiat',
        icon: 'bank',
        url: navigation.app.deposit.fiat,
      },
      {
        title: 'Crypto',
        icon: 'coin',
        url: '/deposit/crypto',
      },
    ],
  },
];

interface UserNavigationProps {
  setVisibleNav: (visible: boolean) => void;
}
export const UserNavigation = ({ setVisibleNav }: UserNavigationProps) => (
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
