import { useMemo } from 'react';
import cn from 'classnames';

import { navigation } from '@navigation';

import { NavLink } from '@components/NavLink';
import { Dropdown } from '../../Dropdown';

import styles from '../Navigation.module.scss';

import { INavigation } from '../..';

const navigationItemsDefault: INavigation[] = [
  {
    title: 'Dashboard',
    url: navigation.app.discover,
    feature: 'dashboard',
  },
  {
    title: 'Trades',
    url: navigation.app.orders.buySell,
    feature: 'buy_sell',
  },
  {
    title: 'Deposits',
    dropdown: [
      {
        title: 'Fiat',
        icon: 'image',
        url: navigation.app.orders.fiat,
        feature: 'deposit_fiat',
      },
      {
        title: 'Crypto',
        icon: 'coin',
        url: navigation.app.orders.crypto,
        feature: 'deposit_crypto',
      },
    ],
  },
  {
    title: 'Coins',
    url: navigation.app.coin.list,
    feature: 'coin_list',
  },
  {
    title: 'Digital Asset Presale',
    url: navigation.app.presale.nft.list,
    feature: 'presale_nfts',
  },
  {
    title: 'Equities',
    url: navigation.app.equities.list,
    feature: 'equities',
  },
];

interface AdminNavigationProps {
  setVisibleNav: (visible: boolean) => void;
}
export const AdminNavigation = ({ setVisibleNav }: AdminNavigationProps) => {
  const navigationItems: INavigation[] = useMemo(() => {
    const items: Array<INavigation> = [];

    navigationItemsDefault.forEach((item) => {
      if (item.feature) {
        items.push(item);
      } else if (item.dropdown) {
        const { dropdown } = item;

        if (dropdown.length) {
          items.push({
            ...item,
            dropdown,
          });
        }
      }
    });

    return items;
  }, [navigationItemsDefault]);

  return (
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
};
